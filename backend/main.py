from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from ml_model import OsteoVisionModel
import uvicorn

# Global variable to hold the initialized ML model
ml_model: OsteoVisionModel = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event to initialize the model on startup, preventing reloads per request."""
    global ml_model
    try:
        ml_model = OsteoVisionModel()
        print("OsteoVision ML Model successfully loaded and ready for predictions.")
    except Exception as e:
        print(f"Failed to load the model on startup: {e}")
    yield
    # Cleanup logic (if any) goes here on shutdown
    ml_model = None

# Initialize the FastAPI app
app = FastAPI(
    title="OsteoVision API",
    description="Backend for classifying bone health and generating Grad-CAM heatmaps.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS middleware for local frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (restrict in actual production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """Endpoint to process an uploaded image and return prediction + heatmap."""
    
    # 1. Validate that the uploaded file is actually an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type '{file.content_type}'. Please upload an image."
        )
    
    try:
        # 2. Read file bytes
        image_bytes = await file.read()
        
        # 3. Pass bytes to the globally initialized model
        response = ml_model.predict(image_bytes)
        return response
        
    except Exception as e:
        # 4. Handle arbitrary processing errors gracefully
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while processing the image: {str(e)}"
        )

if __name__ == "__main__":
    # Run the server locally using Uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)