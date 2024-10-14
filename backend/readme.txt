# AI Notes

This is the FastAPI-based backend application that processes images containing mathematical expressions, equations, or graphical problems. It uses a generative AI model to analyze and solve these problems, providing results through a RESTful API.

## Features

- **Image Processing**: Accepts base64 encoded images and processes them to extract and solve mathematical expressions.

- **AI Integration**: Utilizes a gemini-1.5-flash model to interpret and solve problems from images.

- **RESTful API**: Provides endpoints for image processing and result retrieval.

## Technologies Used

- **FastAPI**: For building the backend API.

- **Uvicorn**: For running the ASGI server.

- **Pillow**: For image processing.

- **Google Generative AI**: For AI-powered problem-solving.

- **Pydantic**: For data validation and settings management.

## Getting Started

### Prerequisites

1. Create a virtual environment and activate it:
 ```bash 
    python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
   
### Running the Application

To start the FastAPI server, run:
    ```bash
    python server.py
    ```

Access the API documentation at `http://localhost:8900/docs`.

## API Endpoints

- **GET /**: Check if the server is running.

- **POST /calculate**: Process an image and return the solved expressions.

## Code Structure

- **server.py**: Main application file that sets up the FastAPI server and defines the API endpoints.

- **utils.py**: Contains utility functions for image analysis and interaction with the AI model.

- **constants.py**: Manages configuration constants and environment variables.

## Security Considerations

- Ensure that your API key is kept secure and not exposed in version control.

- Review CORS settings before deploying to production.