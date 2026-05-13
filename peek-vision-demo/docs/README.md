# PeekVision — AI-Powered Retinal Screening Demo

This is a demonstration project showcasing a web application for AI-powered retinal image screening. The application allows users to upload a retinal image, which is then analyzed by an AI model to identify potential abnormalities. It also maintains a history of past analyses.

The project is divided into two main parts:

*   **Frontend:** A React application that provides the user interface for uploading retinal images, triggering AI analysis, displaying the AI's findings for the latest image, and presenting a historical log of all previous analyses.
*   **Backend:** An Express.js server that orchestrates the AI analysis (by interacting with an external AI service like Ollama/Llava) and stores the analysis reports in a local JSON database.

**Important:** This project is for demonstration purposes only and is **not intended for clinical use or diagnosis.** The AI results are illustrative and should not be used for medical decisions.
