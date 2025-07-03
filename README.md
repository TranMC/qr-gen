# QR Code Generator

This is a React application built with Vite that allows users to generate customizable QR codes for various types of content.

## Features

- Generate QR codes for URLs, Facebook links, plain text, emails, phone numbers, locations, Wi-Fi networks, vCards, and Google Review links.
- Customize QR code colors (single or gradient) and background color.
- Option to customize eye frame and eye ball colors.
- Choose different body and eye ball shapes for the QR code.
- Select error correction level.
- Download generated QR codes as PNG images.
- Copy generated QR codes to clipboard.
- Interactive FAQ section.

## Technologies Used

- React 19
- Vite
- `qr-code-styling` for QR code generation and customization
- `html2canvas` for capturing QR code as an image

## Installation and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd qr-gen
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Preview the production build:**
    ```bash
    npm run preview
    ```