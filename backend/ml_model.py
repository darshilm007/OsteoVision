import io
import base64
import os
import requests
import numpy as np
import torch
import timm
from PIL import Image
from torchvision import transforms
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

def download_weights_if_missing():
    """Downloads weights and strictly verifies they are real models, not HTML error pages."""
    os.makedirs("./model_weights", exist_ok=True)
    
    weights_files = {
        "./model_weights/ConvNeXt_best_int8.pth": "https://huggingface.co/darshilm007/OsteoVision-Weights/resolve/main/ConvNeXt_best_int8.pth",
        "./model_weights/knee_detector.pth": "https://huggingface.co/darshilm007/OsteoVision-Weights/resolve/main/knee_detector.pth"
    }
    
    for path, url in weights_files.items():
        if not os.path.exists(path):
            print(f"Model weight missing at {path}. Downloading from Hugging Face...")
            try:
                response = requests.get(url, stream=True)
                response.raise_for_status()
                with open(path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                
                # Security Check: If file is smaller than 1MB, it is an HTML 404 page, not a model.
                if os.path.getsize(path) < 1000000:
                    os.remove(path)
                    raise ValueError(f"ERROR: {path} is corrupted. Hugging Face returned an HTML page. Did you upload the file to your repo?")
                
                print(f"Successfully downloaded and verified: {path}")
            except Exception as e:
                print(f"ERROR: Failed to download {path}: {e}")

class OsteoVisionModel:
    def __init__(self):
        """Initializes models, transforms, and Grad-CAM on startup with INT8 quantization."""
        
        # 1. Download weights dynamically (Render needs this since servers start fresh)
        download_weights_if_missing()

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ["normal", "osteopenia", "osteoporosis"]
        
        # 2. Initialize and load the Knee Detector Model (MobileNetV3)
        print("Loading Knee Validation Detector...")
        self.detector = timm.create_model("mobilenetv3_small_100", pretrained=False, num_classes=2)
        try:
            detector_weights = torch.load("./model_weights/knee_detector.pth", map_location=self.device, weights_only=False)
            self.detector.load_state_dict(detector_weights)
            print("Successfully loaded knee detector weights.")
        except Exception as e:
            print(f"WARNING: Validation check will be skipped. Error: {e}")
            self.detector = None
            
        if self.detector:
            self.detector.to(self.device)
            self.detector.eval()

        # 3. Initialize the OsteoVision ConvNeXt-Tiny Classifier and apply INT8 Quantization
        print("Loading OsteoVision Classifier (INT8)...")
        self.model = timm.create_model("convnext_tiny.fb_in22k_ft_in1k", pretrained=False, num_classes=3)
        
        # Apply the exact same dynamic quantization structure you used in Colab before loading weights
        self.model = torch.quantization.quantize_dynamic(
            self.model, 
            {torch.nn.Linear, torch.nn.Conv2d}, 
            dtype=torch.qint8
        )
        
        try:
            checkpoint = torch.load("./model_weights/ConvNeXt_best_int8.pth", map_location=self.device, weights_only=False)
            state_dict = checkpoint["model_state_dict"] if "model_state_dict" in checkpoint else checkpoint
            self.model.load_state_dict(state_dict)
            print("Successfully loaded INT8 ConvNeXt model weights.")
        except Exception as e:
            print(f"ERROR loading ConvNeXt: {e}")
            
        self.model.to(self.device)
        self.model.eval()
        
        # 4. Define preprocessing transforms
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        # 5. Pre-load Grad-CAM++ targeting stage 3 normalization
        self.target_layers = [self.model.stages[-1].blocks[-1]]
        self.cam = GradCAMPlusPlus(model=self.model, target_layers=self.target_layers)

    def predict(self, image_bytes: bytes) -> dict:
        """Validates the image is a knee X-ray via MobileNetV3, then runs ConvNeXt-Tiny prediction."""
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        orig_w, orig_h = pil_image.size
        
        input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        
        # STEP 1: Run through MobileNetV3 Knee Detector Guard
        if self.detector is not None:
            with torch.no_grad():
                detector_outputs = self.detector(input_tensor)
                detector_probs = torch.nn.functional.softmax(detector_outputs[0], dim=0)
                predicted_detector_idx = detector_outputs.argmax(dim=1).item()
                detector_confidence = float(detector_probs[predicted_detector_idx].item() * 100)
            
            if predicted_detector_idx == 1 and detector_confidence > 70.0:
                raise ValueError("The uploaded image does not appear to be a valid knee radiograph.")

        # STEP 2: Run Main OsteoVision Classification & Grad-CAM++
        # Note: We briefly enable gradients strictly for Grad-CAM to map the backward pass
        with torch.set_grad_enabled(True):
            # The input tensor requires gradients to draw the heatmap
            input_tensor.requires_grad = True
            
            outputs = self.model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
            predicted_class = self.classes[predicted_idx.item()]
            confidence_pct = float(round(confidence.item() * 100, 2))
            
            # Generate the Grad-CAM++ heatmap
            targets = [ClassifierOutputTarget(predicted_idx.item())]
            grayscale_cam_224 = self.cam(input_tensor=input_tensor, targets=targets, aug_smooth=True)[0]
        
        # Resize heatmap back to the original image dimensions using PIL
        cam_uint8 = (grayscale_cam_224 * 255).astype(np.uint8)
        cam_pil = Image.fromarray(cam_uint8).resize((orig_w, orig_h), Image.Resampling.LANCZOS)
        cam_resized = np.array(cam_pil, dtype=np.float32) / 255.0
        
        rgb_original = np.asarray(pil_image).astype(np.float32) / 255.0
        
        visualization = show_cam_on_image(rgb_original, cam_resized, use_rgb=True)
        
        heatmap_pil = Image.fromarray(visualization)
        buffered = io.BytesIO()
        heatmap_pil.save(buffered, format="JPEG")
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Convert the tensor probabilities to a list
        probs_list = probabilities.tolist()

        return {
            "prediction": predicted_class,
            "confidence": confidence_pct,
            "class_probabilities": {
                "normal": float(round(probs_list[0] * 100, 2)),
                "osteopenia": float(round(probs_list[1] * 100, 2)),
                "osteoporosis": float(round(probs_list[2] * 100, 2))
            },
            "heatmap_base64": heatmap_base64
        }