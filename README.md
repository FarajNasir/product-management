# Product Purchase & Inventory Management System

A comprehensive full-stack application for managing **product purchases, inventory, and vendor relationships**. Built with **React.js, Node.js, Express, MongoDB, and Tailwind CSS**.

---

## 🚀 Features

* **Product Management**: Add, edit, delete, and view products with detailed information.
* **Vendor Management**: Manage vendor details and relationships.
* **Inventory Tracking**: Real-time stock status (In Stock, Low Stock, Out of Stock).
* **Image Upload**: Upload and preview product images.
* **Barcode/QR Code Generation**: Automatically generate scannable codes for products.
* **Search & Filter**: Advanced filtering by category, stock status, and search terms.
* **Pagination**: Efficient handling of large product catalogs.
* **Auto-calculation**: Automatic price calculations including tax and discounts.
* **Responsive Design**: POS-friendly interface that works across devices.

---

## 🛠️ Tech Stack

### Frontend

* React.js (with Vite)
* Tailwind CSS
* React Hook Form
* React Dropzone
* Axios
* Day.js
* JSBarcode & QRCode.react

### Backend

* Node.js (Express.js)
* MongoDB (Mongoose ODM)
* Multer (file uploads)
* JSBarcode & QRCode
* CORS

---

## 📋 Prerequisites

Make sure you have the following installed:

* Node.js (v14 or higher)
* MongoDB (local or MongoDB Atlas)
* npm or yarn

---

## ⚙️ Installation

### 1. Clone or Download the Project

```bash
# Using git
git clone <repository-url>
cd product-purchase-system

# Or using a downloaded zip file
unzip product-purchase-system.zip
cd product-purchase-system
```

### 2. Backend Setup

```bash
cd backend
install dependencies
npm install express mongoose multer cors dotenv jsbarcode qrcode canvas
npm install --save-dev nodemon

# Create .env file
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product_management" > .env  either you can use mongoDB compass or you can use mongoDB Atlas

# Create uploads directory
mkdir uploads

# Start backend server
nodemon server.js
```

### 3. Frontend Setup

```bash

for Tailwind and vite setup
https://tailwindcss.com/docs/installation/using-vite
cd frontend
install dependencies
npm install react react-dom react-router-dom axios react-hook-form react-dropzone jsbarcode qrcode.react dayjs

run front-end 
npm run dev
```

### 4. Database Setup

* Install MongoDB locally, or create a free MongoDB Atlas account.
* Update `MONGODB_URI` in `backend/.env` if using a remote database.

---

## 📖 Usage

### Adding Products

1. Navigate to **Products** section.
2. Click **Add New Product**.
3. Fill in details (name, category, price, tax, quantity, etc.).
4. Upload an image (optional).
5. Select vendor.
6. Save product.

### Managing Vendors

1. Navigate to **Vendors** section.
2. Click **Add New Vendor**.
3. Fill in details (name, contact, email, phone, address).
4. Save vendor.

### Viewing Products

* Use **search bar** for specific products.
* Filter by **category** or **stock status**.
* View **barcode/QR code**.
* Edit or delete products.

---

## 📡 API Documentation

### Products

* `GET /api/products` → Get all products (with pagination & filtering)
* `GET /api/products/:id` → Get single product
* `POST /api/products` → Create new product
* `PUT /api/products/:id` → Update product
* `DELETE /api/products/:id` → Delete product
* `GET /api/products/categories` → Get all categories
* `GET /api/products/:id/barcode` → Generate barcode
* `GET /api/products/:id/qrcode` → Generate QR code

### Vendors

* `GET /api/vendors` → Get all vendors
* `GET /api/vendors/:id` → Get single vendor
* `POST /api/vendors` → Create new vendor
* `PUT /api/vendors/:id` → Update vendor
* `DELETE /api/vendors/:id` → Delete vendor

---

