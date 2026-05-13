# Frontend

The frontend is a React application built with Vite. It uses TypeScript for type safety.

## Overview

The frontend is responsible for:
*   Allowing users to upload retinal images.
*   Sending these images to the backend for AI-powered analysis.
*   Displaying the latest analysis report.
*   Fetching and displaying a history of all past analysis reports from the backend.

## Components

*   **`App`:** The main component that orchestrates the entire application. It handles:
    *   Image file selection and preview.
    *   Triggering the AI analysis by sending the image to the backend's `/analyze` endpoint.
    *   Displaying the result of the latest analysis.
    *   Fetching and managing the state of historical analysis reports from the backend's `/api/reports` endpoint.
    *   Rendering both the current analysis result and the list of past reports.

## Analysis Workflow

1.  A user selects a retinal image file using the upload interface.
2.  The user clicks "Start Analysis."
3.  The `App` component sends the image file to the `POST /analyze` endpoint on the backend.
4.  Upon receiving a response from the backend (which includes the AI's analysis), the `App` component updates its state to display the new result and adds it to the list of historical reports.
5.  When the application loads, it fetches all existing reports from the `GET /api/reports` endpoint to populate the analysis history.
