from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import requests  # CHANGED: Use requests instead of tensorflow

app = FastAPI()

# Origins setup remains the same...
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CHANGED: Define the Docker Endpoint instead of loading the model
# "potato_model" must match the 'name' you put in models.config
ENDPOINT = "http://localhost:8501/v1/models/potato_model:predict"

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    # CHANGED: Create the JSON payload expected by TF Serving
    json_data = {
        "instances": img_batch.tolist()
    }

    # CHANGED: Send request to Docker container
    response = requests.post(ENDPOINT, json=json_data)
    
    # CHANGED: Parse the JSON response from Docker
    prediction = np.array(response.json()["predictions"][0])

    predicted_class = CLASS_NAMES[np.argmax(prediction)]
    confidence = np.max(prediction)
    
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)