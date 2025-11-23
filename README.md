# 🥔 Potato Disease Classification

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg) ![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg) ![React](https://img.shields.io/badge/React-17.0.2-blueviolet.svg)

## 🚀 Project Overview

This project is an end-to-end Deep Learning application designed to help farmers and agriculturalists identify diseases in potato plants. Using a Convolutional Neural Network (CNN) trained on the **PlantVillage** dataset, the system classifies potato leaf images into three categories:

* **Early Blight**
* **Late Blight**
* **Healthy**

The solution includes a trained model, a FastAPI backend server for inference, a React.js web frontend, and a React Native mobile application, with deployment capabilities on Google Cloud Platform (GCP).

---

## 🏗️ Architecture

The system follows a microservices architecture where the frontend communicates with a FastAPI backend. The backend utilizes TensorFlow Serving (or a loaded `.h5` model) to perform inference on images.

```mermaid
graph LR
    A[User] -->|Upload Image| B(React Frontend / Mobile App)
    B -->|POST /predict| C{FastAPI Server}
    C -->|Request| D[TensorFlow Model]
    D -->|Prediction| C
    C -->|JSON Response| B
    B -->|Display Result| A