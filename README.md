# OMM

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). The application features a comprehensive admin panel for management and a user-friendly frontend for shopping.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Admin Panel](#admin-panel)
  - [User Frontend](#user-frontend)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Admin Panel Setup](#admin-panel-setup)
  - [User Frontend Setup](#user-frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a complete e-commerce solution with:
- **Backend API**: Node.js/Express server handling all business logic
- **Admin Dashboard**: React-based management interface for products and orders
- **Customer Frontend**: Responsive shopping interface for browsing and purchasing products
- **Payment Integration**: Stripe and Razorpay support for secure transactions
- **Image Management**: Cloudinary integration for product images

## Features

### Admin Panel

The admin panel provides comprehensive tools for managing the e-commerce store:

- **Authentication**: Secure admin login with JWT-based authentication
- **Product Management**:
  - Add new products with detailed information (name, description, price, category, sub-category, sizes)
  - Upload and manage multiple product images via Cloudinary
  - Edit existing product details
  - Delete products from inventory
  - View complete product list with search and filter capabilities
- **Order Management**:
  - View all customer orders
  - Track order status in real-time
  - Update order status (Order Placed → Packing → Shipped → Out For Delivery → Delivered)
  - Manage customer information and delivery details
- **Website Information**: Manage and update website information and policies

### User Frontend

The customer-facing frontend provides a complete shopping experience:

- **User Authentication**: 
  - Register new accounts
  - Secure login and logout
  - Profile management
- **Product Discovery**:
  - Browse products on home and collection pages
  - View detailed product information with multiple images
  - Search products by name and keywords
  - Filter products by category and sub-category
  - Sort products by price and relevance
- **Shopping Experience**:
  - Add products to cart with size selection
  - Manage cart quantities and remove items
  - View real-time cart totals
  - Wishlist functionality (implied)
- **Checkout & Payment**:
  - Secure checkout process
  - Multiple payment options:
    - Cash on Delivery (COD)
    - Stripe payment gateway
    - Razorpay integration
  - Order verification and confirmation
- **User Account**:
  - View order history
  - Track order status
  - Manage personal information
- **Informational Pages**:
  - About Us page with company information
  - Contact Us page with support details
  - Newsletter subscription
  - Policies and terms

## Technologies Used

### Frontend (Admin & User)
- **React.js** - UI framework
- **Vite** - Modern build tool for fast development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Notification library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library
- **Cloudinary** - Image storage and management
- **Multer** - Middleware for file uploads
- **JWT (JSON Web Tokens)** - Authentication tokens
- **Bcrypt** - Password hashing and security
- **Validator** - Input validation library
- **CORS** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management
- **Stripe** - Payment gateway integration
- **Razorpay** - Alternative payment gateway (optional)

## Project Structure

```
Project_OMM/
├── backend/                    # Node.js/Express API server
│   ├── configs/               # Database and service configurations
│   ├── controllers/           # Business logic for routes
│   ├── middlewares/           # Authentication, file upload, etc.
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoint definitions
│   ├── server.js              # Main backend entry point
│   └── package.json           # Backend dependencies
├── admin/                      # Admin dashboard (React)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Admin pages (Add, List, Orders, etc.)
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main admin app component
│   │   └── main.jsx           # Vite entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Admin dependencies
├── frontend/                   # Customer shopping interface (React)
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar, Cart, etc.)
│   │   ├── contexts/          # React Context for state management
│   │   ├── pages/             # Customer pages (Home, Product, Cart, etc.)
│   │   ├── assets/            # Static assets and images
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main frontend app component
│   │   └── main.jsx           # Vite entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json           # Frontend dependencies
└── README.md                  # This file
```

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - Either:
  - MongoDB Atlas account (cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
  - Local MongoDB instance - [Installation guide](https://docs.mongodb.com/manual/installation/)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/) for image storage
- **Stripe Account** - [Sign up](https://stripe.com/) for payment processing
- **Git** - [Download](https://git-scm.com/) for cloning the repository

### Backend Setup

1. **Clone the repository and navigate to backend:**
   ```bash
   git clone <repository_url>
   cd Ecommerce-Store-Forever-MERN-main/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the backend directory:**
   ```bash
   touch .env    # On Windows: type nul > .env
   ```

4. **Configure environment variables:**
   Add the following variables to your `.env` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT Authentication
   JWT_SECRET=your_super_secret_jwt_key_here

   # Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin_password_123

   # Cloudinary (Image Storage)
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server Port
   PORT=3000
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`

### Admin Panel Setup

1. **Navigate to the admin directory:**
   ```bash
   cd ../admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the admin directory:**
   ```bash
   touch .env    # On Windows: type nul > .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

5. **Start the admin panel:**
   ```bash
   npm run dev
   ```
   The admin panel will be available at `http://localhost:5174`

### User Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the frontend directory:**
   ```bash
   touch .env    # On Windows: type nul > .env
   ```

4. **Configure environment variables:**
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

5. **Start the user frontend:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT token signing | `your_random_secret_key_here` |
| `ADMIN_EMAIL` | Admin account email for login | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin account password | `securePassword123` |
| `CLOUDINARY_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | `sk_test_xxxxx` |
| `PORT` | Backend server port | `3000` |

### Frontend/Admin (`admin/.env` and `frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API server URL | `http://localhost:3000` |

### Important Notes

- **Never commit `.env` files** to version control - they contain sensitive credentials
- Use strong, random secrets for `JWT_SECRET`
- Keep all API keys and secrets confidential
- For production, use environment variables from your hosting platform's configuration system

## Running the Application

Once all three parts are set up, you can run them simultaneously for full functionality:

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
Runs on: `http://localhost:3000`

### Terminal 2 - Admin Panel
```bash
cd admin
npm run dev
```
Runs on: `http://localhost:5174`

### Terminal 3 - Customer Frontend
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:5173`

### Access Points

- **Customer Store**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:3000

### Default Admin Login

Use the following credentials to log in to the admin panel:
- **Email**: `admin@example.com` (or as configured in `.env`)
- **Password**: `admin_password_123` (or as configured in `.env`)

## API Endpoints Summary

The backend provides the following API routes:

- **Products** (`/api/product/*`) - CRUD operations for products
- **Users** (`/api/user/*`) - User authentication and management
- **Cart** (`/api/cart/*`) - Shopping cart operations
- **Orders** (`/api/order/*`) - Order creation and tracking
- **Website Info** (`/api/website-info/*`) - Website information management

## Contributing

Contributions are welcome! To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Backend won't connect to MongoDB**
- Verify your `MONGODB_URI` is correct
- Check your MongoDB Atlas IP whitelist includes your current IP
- Ensure the MongoDB service is running (if using local MongoDB)

**Admin/Frontend can't connect to backend**
- Verify `VITE_BACKEND_URL` matches your backend address
- Check if backend server is running on the specified port
- Look for CORS errors in the browser console

**Port already in use**
- Change the `PORT` variable in backend `.env`
- Vite will automatically use the next available port if 5173/5174 are taken

**Cloudinary upload errors**
- Verify your Cloudinary credentials are correct
- Check that image file sizes are within limits
- Ensure your Cloudinary account has upload permissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Last Updated**: January 2026
 
 
