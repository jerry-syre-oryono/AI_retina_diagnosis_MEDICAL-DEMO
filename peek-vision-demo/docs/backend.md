# Backend

The backend is an Express.js server that orchestrates the AI-powered retinal image analysis and manages the storage of analysis reports.

## Database

The backend uses `lowdb`, a small local JSON database, to persistently store the analysis reports. The database is initialized when the server starts.

## API Endpoints

The backend exposes the following API endpoints:

*   **`POST /analyze`**
    *   **Description:** Receives an uploaded retinal image, sends it to an external AI service (DeepSeek/Ollama), processes the AI's response, and saves the analysis report to the database.
    *   **Input:** `multipart/form-data` containing an `image` file.
    *   **Process:**
        1.  The uploaded image is read and base64 encoded.
        2.  The encoded image is sent to the configured DeepSeek/Ollama endpoint (`http://localhost:11434/api/generate`) with a specific prompt for ophthalmological analysis.
        3.  The AI's JSON response (containing `result`, `confidence`, and `recommendations`) is parsed.
        4.  A new report object, including a unique ID, filename, creation timestamp, and the AI's analysis, is created.
        5.  This report is stored in the `lowdb` database.
    *   **Output:** The newly created `Report` object.

*   **`GET /api/reports`**
    *   **Description:** Retrieves all historical analysis reports stored in the database.
    *   **Output:** An array of `Report` objects.

## AI Integration

The backend integrates with a local Ollama instance running the `llava:7b` model (or a similar DeepSeek model). It sends the base64 encoded image along with a detailed prompt to guide the AI in performing a relevant ophthalmological analysis.
