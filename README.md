# 🛒 OMM | Full-Stack MERN E-Commerce

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)

A comprehensive, production-ready e-commerce solution built with the MERN stack. This project features a dual-interface system: a sleek **Customer Storefront** and a powerful **Admin Management Dashboard**.

---

## 📖 Table of Contents
- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Technologies Used](#-technologies-used)
- [📂 Project Structure](#-project-structure)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🔐 Environment Variables](#-environment-variables)
- [🚦 Running the Application](#-running-the-application)

---

## 🚀 Overview

OMM (Online Merchant Manager) is designed to handle high-traffic retail needs.
- **Backend**: Robust Node.js & Express API.
- **Admin Dashboard**: Real-time inventory and order management.
- **Customer Frontend**: Responsive shopping UI with fast search and filtering.
- **Payments**: Integrated support for **Stripe**, **Razorpay**, and COD.
- **Storage**: **Cloudinary** integration for optimized image delivery.

---

## ✨ Features

### 👔 Admin Dashboard
* **Inventory Control**: Full CRUD (Create, Read, Update, Delete) for products.
* **Media Management**: Bulk image uploads via Cloudinary.
* **Order Tracking**: Real-time status updates (Packing ➜ Shipped ➜ Delivered).
* **Security**: JWT-protected admin authentication.

### 🛍️ User Frontend
* **Product Discovery**: Category filtering, size selection, and smart search.
* **User Experience**: Persistent shopping cart and wishlist functionality.
* **Secure Checkout**: Multi-gateway payment integration.
* **Personalization**: User profiles with order history and tracking.
* **Marketing**: Newsletter subscription and responsive contact forms.

---

## 🛠 Technologies Used

| Layer | Stack |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Axios, React Toastify |
| **Backend** | Node.js, Express.js, JWT, Bcrypt, Multer |
| **Database** | MongoDB, Mongoose (ODM) |
| **Integrations** | Cloudinary (Images), Stripe & Razorpay (Payments) |

---

## 📂 Project Structure

```bash
Project_OMM/
├── backend/    # API Server & Business Logic
├── admin/      # Management UI (React + Vite)
└── frontend/   # Customer UI (React + Vite)
