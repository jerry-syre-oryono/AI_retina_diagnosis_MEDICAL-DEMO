# Peek Vision Demo

This project is a demonstration of using a local AI model to analyze retinal fundus images.

## Project Structure

- `frontend`: A React application that provides the user interface for uploading and viewing image analysis.
- `backend`: An Express.js server that handles image uploads, communicates with the AI model, and returns the analysis results.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Ollama](https://ollama.ai/) installed and running.
- The `llava` model pulled by Ollama (`ollama pull llava`).

## How to Run

1.  **Run the AI Model:**
    - Make sure your Ollama application is running and accessible at `http://localhost:11434`.

2.  **Run the Backend:**
    - Open a new terminal and navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Install the dependencies:
      ```bash
      npm install
      ```
    - Start the backend server in development mode:
      ```bash
      npm run dev
      ```
    - The backend will be running at `http://localhost:4000`.

3.  **Run the Frontend:**
    - Open another new terminal and navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Install the dependencies:
      ```bash
      npm install
      ```
    - Start the frontend development server:
      ```bash
      npm run dev
      ```
    - The frontend will open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

4.  **Use the Application:**
    - Open your browser to the frontend URL.
    - Upload a retinal fundus image to see the AI analysis.
