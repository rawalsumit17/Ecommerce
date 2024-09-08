# E-Commerce Website

Welcome to the E-Commerce Website project! This project is a full-stack application built using the MERN stack. It features a clothing store with functionalities for both customers and administrators.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is an e-commerce website designed for selling clothes. It leverages the MERN stack for the backend and frontend development. Here’s a brief overview of the technologies used and the structure of the application:

- **Frontend**: Built with React and Vite for a modern, high-performance user interface. It includes React Router DOM for seamless navigation.
- **Backend**: Developed using Express.js and connected to MongoDB Atlas for database management. The backend handles authentication, image uploads, and data operations.
- **Admin Panel**: A React-based admin interface to manage products, view orders, and oversee other administrative functions.

## Technologies Used

- **Frontend**: React, Vite, React Router DOM
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: CORS, .env for environment variables
- **Image Storage**: Multer for storing and uploading images

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Product Management**: Admins can add, update, and delete products.
- **Order Management**: Customers can view and place orders, while admins can manage and view orders.
- **Responsive Design**: Fully responsive frontend for a seamless experience across devices.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/e-commerce-website.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd e-commerce-website
   ```

3. **Install dependencies for both backend and frontend:**

   **Backend:**

   ```bash
   cd backend
   npm install
   ```

   **Frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. **Create a `.env` file in the `backend` directory and add your MongoDB connection string:**

   ```env
   MONGODB_URI = mongodb+srv://<enter_username>:<Enter_password>@cluster0.x7id7.mongodb.net/ecommerce
   ```

2. **Ensure the `.env` file is properly configured for your environment.**

## Usage

1. **Start the backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server:**

   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Access the application in your browser:**

   Open `http://localhost:3000` for the frontend.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

---

Feel free to reach out if you have any questions or need further assistance!
