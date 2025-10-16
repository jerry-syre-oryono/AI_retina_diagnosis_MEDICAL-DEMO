# Frontend

The frontend is a React application built with Vite. It uses TypeScript for type safety.

## Components

*   **`App`:** The main component that orchestrates the application.
*   **`ImageUploader`:** A component that allows users to upload a retina photo. It performs a basic analysis of the image quality, including brightness, red mean, and edge count.
*   **`ReportView`:** A component that displays the analysis report.

## Analysis

The frontend performs a simple analysis of the uploaded image. The analysis includes the following metrics:

*   **Brightness:** The average brightness of the image.
*   **Red Mean:** The average value of the red channel.
*   **Edge Count:** A simple edge detection algorithm to count the number of edges in the image.

Based on these metrics, the application provides a simple conclusion about the image quality.
