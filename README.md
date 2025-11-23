🥔 Potato Disease Classification: End-to-End Deep Learning Project

An end-to-end Deep Learning application capable of detecting Early Blight, Late Blight, and Healthy potato leaves with high accuracy. This system uses a Convolutional Neural Network (CNN) for classification, served via TensorFlow Serving (Docker), connected to a FastAPI backend, and displayed through a modern React frontend.

📸 Output Screenshots

Landing Page

Prediction Result

<img src="./screenshots/home_page.png" width="400">

<img src="./screenshots/prediction_result.png" width="400">

Clean, user-friendly Drag & Drop Interface

Real-time classification with Confidence Score

🚀 Project Architecture

This project implements a scalable Microservices Architecture:

Frontend (React + Vite + Tailwind): A responsive UI for users to upload images.

API Gateway (FastAPI): Receives the image, performs preprocessing (resizing/normalization), and acts as a bridge.

Model Serving (Docker + TF Serving): A dedicated, production-grade server that hosts the trained .h5 model and handles inference requests.

graph LR
    A[User / Frontend] -- Image --> B[FastAPI Backend]
    B -- Preprocessed Array --> C[Docker / TF Serving]
    C -- Prediction --> B
    B -- JSON Response --> A


🛠️ Tech Stack

Deep Learning: TensorFlow, Keras, CNN (Convolutional Neural Networks)

Backend: FastAPI, Uvicorn, Python

Model Serving: TensorFlow Serving, Docker

Frontend: React.js, Vite, Tailwind CSS, Axios

IDE/Tools: VS Code, Postman, Google Colab (for training)

🧠 Model Performance

The model was trained on the PlantVillage Dataset.

Accuracy: ~98% (on Validation Set)

Classes:

Potato___Early_blight

Potato___Late_blight

Potato___healthy

💻 Setup & Installation

Follow these steps to run the project locally.

1. Prerequisites

Docker Desktop installed & running

Python 3.8+

Node.js & npm

2. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/potato-disease-classification.git](https://github.com/YOUR_USERNAME/potato-disease-classification.git)
cd potato-disease-classification


3. Start TensorFlow Serving (Docker)

This command pulls the TF Serving image and starts the model server on port 8501.
(Ensure your models.config file path is correct in the command below)

docker run -t --rm -p 8501:8501 \
    -v C:/Resume_projects/Potato-disease-classification:/potato-disease-classification \
    tensorflow/serving \
    --model_config_file=/potato-disease-classification/models.config \
    --model_config_file_poll_wait_seconds=60


4. Start the Backend (FastAPI)

Open a new terminal in the project root:

cd api
pip install -r requirements.txt
uvicorn main:app --reload


Server runs at: http://localhost:8000

5. Start the Frontend (React)

Open a new terminal in the project root:

cd frontend
npm install
npm run dev


UI runs at: http://localhost:5173

📂 Project Structure

potato-disease-classification/
├── api/                   # FastAPI Backend
│   ├── main.py            # API Routes & Logic
│   └── requirements.txt   # Python Dependencies
├── frontend/              # React Frontend
│   ├── src/               # React Components & Styles
│   └── tailwind.config.js # Styling Config
├── saved_models/          # Trained Models
│   └── 1/                 # Version 1 (SavedModel format)
├── training/              # Jupyter Notebooks
│   └── potato-disease.ipynb # Model Training Code
├── models.config          # TF Serving Configuration
└── README.md              # Project Documentation


🤝 Acknowledgements

Dataset provided by PlantVillage.

Project inspiration and guidance from the Codebasics Deep Learning series.