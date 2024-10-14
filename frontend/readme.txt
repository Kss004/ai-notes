# AI Notes

AI Notes Calculator is a web application that allows users to draw mathematical expressions on a canvas and calculate their results using an AI-powered backend. The application is built using React, Vite, and TypeScript, and it leverages various libraries for UI components and drawing functionalities.

## Features

- **Canvas Drawing**: Draw mathematical expressions on a canvas.
- **AI Calculation**: Send the drawn expressions to a backend for calculation.
- **Dynamic LaTeX Rendering**: Display results using LaTeX for clear mathematical representation.
- **Responsive Design**: Works well on various screen sizes.

## Technologies Used

- **React**: For building the user interface.
- **Vite**: For fast development and build tooling.
- **TypeScript**: For type-safe JavaScript development.
- **Mantine**: For UI components.
- **Axios**: For making HTTP requests to the backend.
- **MathJax**: For rendering LaTeX expressions.
- **Tailwind CSS**: For styling.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation


1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a .env.local file in the directory and paste your backend localhost URL:
    
    ```bash
    VITE_API_URL=your_localhost_url
    ```

### Running the Application

To start the development server, run:
    
    ```bash
    npm run dev
    ```
