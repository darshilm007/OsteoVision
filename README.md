
# 🦴 OsteoVision
### Making Bone Health Analysis More Understandable with Explainable AI

**Can artificial intelligence help us understand what a knee X-ray might reveal about bone health?**

OsteoVision is an AI-powered project that analyzes knee X-ray images to classify them into three categories: **Normal, Osteopenia, and Osteoporosis**. It combines deep learning with visual explanations to make AI predictions easier to understand.

Beyond providing a prediction, OsteoVision uses heatmaps to highlight the regions of an X-ray that influenced the model's decision, helping users see *where the AI focused* when making its prediction.

---

## 💡 Why OsteoVision?

Bone conditions such as osteopenia and osteoporosis can affect bone strength and increase the risk of fractures. Understanding these conditions is important for bone health assessment.

OsteoVision explores how AI can analyze medical images and present its findings in a more accessible way.

Instead of showing only a predicted result, the platform aims to provide a clearer picture through prediction confidence, visual explanations, risk-level information, and downloadable reports.

## ✨ What Can OsteoVision Do?

- 🩻 **Analyze Knee X-rays** — Upload an X-ray image for AI-powered classification.
- 🧠 **Classify Bone Conditions** — Predict whether an image belongs to the Normal, Osteopenia, or Osteoporosis category.
- 📊 **Show Prediction Confidence** — Display confidence scores associated with the model's predictions.
- 🔥 **Visualize AI Attention** — Generate Grad-CAM heatmaps that highlight image regions influencing the prediction.
- ⚠️ **Present Risk-Level Information** — Display risk-related information based on the system's prediction logic.
- 📄 **Generate PDF Reports** — Organize prediction results and related information into a downloadable report.
- 🌐 **Provide a User-Friendly Interface** — Bring image upload, predictions, and visual explanations together in one web application.

## 🔍 How Does It Work?

You don't need to understand artificial intelligence to follow the process.

**1. Upload an X-ray**

The user provides a knee X-ray image through the web application.

**2. The AI examines the image**

The image is processed into a format suitable for the trained deep learning model.

**3. A prediction is generated**

The model classifies the image into one of three categories: Normal, Osteopenia, or Osteoporosis.

**4. See the explanation**

A Grad-CAM heatmap highlights regions that contributed to the model's prediction. This helps users visualize the model's focus, although it does not prove that the highlighted regions are medically meaningful.

**5. Review the results**

The interface presents the prediction, confidence information, visual explanation, and applicable risk-level information. A PDF report can also be generated.

## 🧠 The AI Behind OsteoVision

OsteoVision uses **ConvNeXt-Tiny**, a deep learning model designed to recognize patterns in images.

In simple terms, the model learns visual patterns from X-ray images during training and uses those learned patterns to make predictions on new images.

The project also uses **Grad-CAM (Gradient-weighted Class Activation Mapping)**, an explainable AI technique that creates a heatmap showing which image regions influenced a particular prediction.

Together, these technologies help the system provide both a classification result and a visual explanation of its output.

## 🩻 What Does It Classify?

| Category | Meaning |
|---|---|
| **Normal** | The image belongs to the dataset's normal category. |
| **Osteopenia** | The image belongs to the category associated with lower bone density than normal. |
| **Osteoporosis** | The image belongs to the category associated with osteoporosis. |

Osteopenia and osteoporosis are distinct conditions associated with reduced bone density and bone strength to different degrees. The model predicts image categories; it does not independently establish a clinical diagnosis.

## 📊 Dataset at a Glance

OsteoVision uses a preprocessed dataset of **1,548 knee X-ray images** across three classes.

| Category | Number of Images |
|---|---:|
| Normal | 456 |
| Osteopenia | 685 |
| Osteoporosis | 407 |
| **Total** | **1,548** |

The images are prepared for model training and evaluation through resizing, RGB conversion, normalization, and other preprocessing steps.

## 🛠️ Technology Behind the Project

| Technology | Purpose |
|---|---|
| React + Vite | Builds the web interface |
| Python + FastAPI | Handles backend requests and model predictions |
| PyTorch | Runs the deep learning model |
| ConvNeXt-Tiny | Classifies knee X-ray images |
| Grad-CAM | Generates visual explanations |
| Pillow + torchvision | Supports image processing and preprocessing |
| Hugging Face | Stores model weights for retrieval by the backend |

## 🎯 Our Goal

The goal of OsteoVision is to explore a more understandable approach to AI-assisted medical image analysis.

By combining image classification, prediction confidence, visual explanations, and structured reporting, the project demonstrates how deep learning can be integrated into an accessible web-based application.

## ⚠️ Important Medical Disclaimer

**OsteoVision is an academic and research project, not a clinically validated diagnostic system.**

Its predictions and heatmaps may be inaccurate and must not be used to diagnose or rule out osteoporosis or osteopenia, determine treatment, or replace professional medical advice. A qualified healthcare professional should interpret medical images and make clinical decisions using appropriate assessments.

---

*OsteoVision — Bringing AI predictions and visual explanations together for more understandable bone health analysis.*
