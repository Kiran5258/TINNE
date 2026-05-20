# Tinne E-Commerce Website

Tinne is a modern e-commerce platform built for high-performance product sales, featuring an interactive and beautiful client interface, comprehensive admin management dashboards, secure payment integrations, and Firebase authentication.

## Live Application
The live application is hosted at:
👉 **[https://tinne.onrender.com/](https://tinne.onrender.com/)**

---

## Repository Structure

*   **[`/frontendFinal`](./frontendFinal)**: React (Vite, TypeScript, Tailwind CSS/Vanilla CSS) application client interface.
*   **[`/backend`](./backend)**: Node.js (Express, MongoDB/Mongoose, Firebase Admin SDK) application server.

---

## Getting Started

### Prerequisites
*   Node.js (version 18 or above recommended)
*   MongoDB Instance / Connection URI

### Running the Frontend Locally

1.  Navigate into the frontend directory:
    ```bash
    cd frontendFinal
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environmental variables in a `.env` file (see `frontendFinal/.env` for configuration templates: Firebase configs, Razorpay, Google Client ID, and `VITE_API_URL`).
4.  Start the development server:
    ```bash
    npm run dev
    ```

### Running the Backend Locally

1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables in `backend/.env` (connection keys for MongoDB, Cloudinary, Razorpay, Mailjet, Firebase project ID, and JWT Secret).
4.  Seed standard products/settings data (optional):
    ```bash
    npm run seed
    ```
5.  Start the backend server in development mode:
    ```bash
    npm run dev
    ```

---

## Features
*   **Firebase Authentication**: Secure social sign-in (Google) and email validation with OTPs.
*   **Shopping Cart & Promos**: Global offers and customized coupon code entry checks.
*   **Admin Dashboard**: Manage inventory, hero showcase banners, and order statuses.
*   **Invoice Generator**: Export order invoices dynamically to PDF.
