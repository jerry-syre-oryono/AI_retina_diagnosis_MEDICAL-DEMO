# Backend

The backend is an Express.js server that provides a simple API for storing and retrieving analysis reports.

## Database

The backend uses `lowdb`, a small local JSON database, to store the reports. The database is initialized when the server starts.

## API

The backend exposes the following API endpoints:

*   **`POST /api/reports`:** Saves a new analysis report to the database.
*   **`GET /api/reports`:** Retrieves all the analysis reports from the database.
