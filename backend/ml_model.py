import io
import base64
import cv2
import numpy as np
import torch
import timm
from PIL import Image
from torchvision import transforms
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

class OsteoVisionModel:
    def __init__(self):
        """Initializes the model, transforms, and Grad-CAM extractor on startup."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ["normal", "osteopenia", "osteoporosis"]
        
        # 1. Initialize the ConvNeXt-Tiny model
        self.model = timm.create_model("convnext_tiny.fb_in22k_ft_in1k", pretrained=False, num_classes=3)
        
       # 2. Load the trained weights
        try:
            checkpoint = torch.load("./model_weights/ConvNeXt_best.pth", map_location=self.device)
            
            # Extract the actual weights if saved as a checkpoint dictionary
            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
            else:
                state_dict = checkpoint
                
            self.model.load_state_dict(state_dict)
            print("Successfully loaded model weights.")
        except FileNotFoundError:
            print("WARNING: Weights file not found at ./model_weights/ConvNeXt_best.pth. Model initialized with random weights.")
            
        self.model.to(self.device)
        self.model.eval() # Set to evaluation mode
        
        # 3. Define the preprocessing transforms
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # 4. Setup Grad-CAM Plus Plus targeting the final block of stage 3
        self.target_layers = [self.model.stages[3].blocks[-1]]
        self.cam = GradCAMPlusPlus(model=self.model, target_layers=self.target_layers)

    def predict(self, image_bytes: bytes) -> dict:
        """Runs fast inference and maps the heatmap back to the original image size."""
        
        # 1. Load ORIGINAL image and save its exact dimensions
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        orig_w, orig_h = pil_image.size
        
        # 2. Preprocess the image specifically for the model (224x224 + Normalized)
        # This matches your training format perfectly to get accurate results
        input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        
        # 3. Run Inference
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
        predicted_class = self.classes[predicted_idx.item()]
        confidence_pct = round(confidence.item() * 100, 2)
        
        # 4. Generate the 224x224 Grad-CAM++ heatmap
        targets = [ClassifierOutputTarget(predicted_idx.item())]
        grayscale_cam_224 = self.cam(input_tensor=input_tensor, targets=targets, aug_smooth=True)[0]
        
        # 5. UPSCALE the heatmap to match the original image dimensions
        cam_resized = cv2.resize(grayscale_cam_224, (orig_w, orig_h))
        
        # 6. Prepare the ORIGINAL unaltered high-res image for overlay
        rgb_original = np.asarray(pil_image).astype(np.float32) / 255.0
        
        # 7. Blend the scaled heatmap directly onto the original image
        visualization = show_cam_on_image(rgb_original, cam_resized, use_rgb=True)
        
        # Convert to Base64 string
        heatmap_pil = Image.fromarray(visualization)
        buffered = io.BytesIO()
        heatmap_pil.save(buffered, format="JPEG")
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {
            "prediction": predicted_class,
            "confidence": confidence_pct,
            
            "heatmap_base64": heatmap_base64
        }