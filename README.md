<!-- # StockFlow Pro

Inventory & Order Management System.

## Quick Start
1. Clone repo
2. `docker compose up -d`
3. Frontend: http://localhost
4. Backend Swagger: http://localhost:8000/docs

## Tech Stack
- FastAPI, SQLAlchemy, PostgreSQL
- React, Vite, Tailwind CSS, React Query
- Docker, Docker Compose -->
# StockFlow Pro – Inventory & Order Management System

A modern, full-stack **Inventory & Order Management** SaaS platform built for small and medium businesses.

Manage products, customers, orders, and inventory levels with a clean, responsive interface and powerful business automation.

---

## 🌐 Live Application

| Service          | URL                                              |
| ---------------- | ------------------------------------------------ |
| **Frontend**     | https://stockflow-pro-rho.vercel.app             |
| **Backend API**  | https://stockflow-backend-r0re.onrender.com      |
| **Swagger Docs** | https://stockflow-backend-r0re.onrender.com/docs |
| **Docker Hub**   | `adityaiitbhu26/stockflow-backend:latest`        |

---

## 🚀 What is StockFlow Pro?

StockFlow Pro helps businesses **track inventory, process customer orders, and monitor operational performance** from a centralized dashboard.

It automatically calculates order totals, reduces stock when orders are placed, prevents overselling, and restores stock when orders are cancelled.

Built with a production-grade tech stack and deployed on free cloud platforms, it demonstrates real-world software engineering practices.

---

## 🎯 Target Users

* Retail stores – manage physical product inventory and walk-in orders.
* E-commerce sellers – keep online product listings in sync with actual stock.
* Wholesalers – handle bulk orders and track customer relationships.
* Warehouse staff – monitor low-stock alerts and fulfil orders.
* Business owners – view revenue, top-selling products, and customer trends.

---

# ✨ Core Features

## 📦 Product Management

* Add, edit, delete products with:

  * Name
  * SKU
  * Description
  * Category
  * Price
  * Stock Quantity

* Unique SKU enforcement prevents duplicate identifiers.

* Price must be greater than 0.

* Quantity cannot be negative.

* Search by name or SKU.

* Filter by category.

* Sort by:

  * Name
  * Price
  * Stock
  * Date

### Additional Features

* CSV Import for bulk uploads.
* CSV Export for spreadsheet downloads.
* Bulk Delete for multiple products.
* Low-stock visual alerts when quantity ≤ 5.

---

## 👥 Customer Management

* Add customers with:

  * Full Name
  * Email
  * Phone
  * Address

* Search and delete customers.

* Unique email validation.

* Phone format validation.

* Customer Order History with one-click order filtering.

---

## 🛒 Order Management

### Order Creation

* Select a customer.
* Add one or more products.
* Automatic total calculation.
* Inventory validation before checkout.

### Inventory Automation

* Stock decreases automatically when an order is placed.
* Atomic database transactions ensure consistency.
* Cancelled orders automatically restore inventory.

### Workflow

```text
Pending → Confirmed → Processing → Completed
```

### Additional Features

* Filter orders by status.
* Filter orders by date range.
* Sortable columns.
* CSV Export.
* PDF Invoice generation.
* Print-friendly invoices.

---

## 📊 Dashboard & Analytics

### Summary Metrics

* Total Products
* Total Customers
* Total Orders
* Total Revenue

### Visual Analytics

* Revenue Trend Bar Chart
* Order Status Pie Chart

### Insights

* Top Selling Products
* Top Customers
* Recent Orders
* Low-Stock Products
* Out-of-Stock Products

---

## ⚙️ Additional Production Features

* Dark Mode toggle.
* Notification bell for low-stock alerts.
* Profile page for business details and logo uploads.
* Delete confirmation dialogs.
* Fully responsive design.
* Lazy-loaded routes for performance optimization.

---

# 🏗️ Technical Architecture

## Backend (FastAPI + Python)

### Architecture

```text
Routes
   ↓
Services
   ↓
Repositories
   ↓
Database
```

### Technologies

* FastAPI
* SQLAlchemy ORM
* PostgreSQL
* Alembic Migrations
* Pydantic Validation
* SlowAPI Rate Limiting

### Backend Features

* CORS Configuration
* Health Check Endpoint (`/health`)
* Structured JSON Logging
* Atomic Transactions

---

## Frontend (React + Vite)

### Technologies

* React
* Vite
* Tailwind CSS
* React Query
* React Hook Form
* React Router
* Recharts
* jsPDF
* html2canvas
* react-hot-toast

### UI Design

* Indigo/Slate theme
* Shadcn-inspired reusable components
* Responsive layouts
* Optimized client-side caching

---

## 🚢 DevOps & Deployment

### Containerization

* Docker
* Multi-stage builds
* Docker Compose

### Cloud Hosting

* Render → Backend
* Vercel → Frontend
* Neon → PostgreSQL Database

### CI/CD

* GitHub Actions
* Automated frontend builds on every push

---

# 📋 Business Rules Enforced

| Rule                            | Implementation           |
| ------------------------------- | ------------------------ |
| SKU must be unique              | Database unique index    |
| Customer email must be unique   | Database unique index    |
| Price > 0                       | Pydantic Validation      |
| Quantity ≥ 0                    | Pydantic Validation      |
| Stock availability required     | Service Layer Validation |
| Order total auto-calculated     | Backend Computation      |
| Inventory deduction on order    | Atomic Transaction       |
| Inventory restoration on cancel | Automatic Stock Recovery |
| Valid HTTP Status Codes         | REST Standards           |

---

# 📡 API Endpoints

**Base URL:** `/api/v1`

## Products

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | `/products/`       |
| GET    | `/products/`       |
| GET    | `/products/{id}`   |
| PUT    | `/products/{id}`   |
| DELETE | `/products/{id}`   |
| POST   | `/products/import` |

## Customers

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | `/customers/`     |
| GET    | `/customers/`     |
| GET    | `/customers/{id}` |
| DELETE | `/customers/{id}` |

## Orders

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/orders/`            |
| GET    | `/orders/`            |
| GET    | `/orders/{id}`        |
| PUT    | `/orders/{id}/status` |
| DELETE | `/orders/{id}`        |

## Dashboard

| Method | Endpoint      |
| ------ | ------------- |
| GET    | `/dashboard/` |

---

## Standard API Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Pagination Format

```json
{
  "success": true,
  "data": [],
  "page": 1,
  "limit": 20,
  "total": 42
}
```

---

# 🐳 Running Locally with Docker

## Clone Repository

```bash
git clone https://github.com/AdityaIITBHU26/stockflow-pro.git
cd stockflow-pro
```

## Configure Environment

```bash
cp backend/.env.example backend/.env
```

Update environment variables if required.

## Start Services

```bash
docker compose up -d
```

## Access Applications

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost             |
| Swagger Docs | http://localhost:8000/docs   |
| Health Check | http://localhost:8000/health |

---

# 🧪 Testing

## Backend

```bash
pytest
```

Located in:

```text
backend/tests/
```

## Frontend

* React Testing Library supported.
* Component testing setup included.

## CI

GitHub Actions automatically validates frontend builds.

---

# 📁 Project Structure

```text
stockflow-pro/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

# 🙌 Acknowledgements

Built as a demonstration of full-stack engineering skills using modern technologies:

* FastAPI
* React
* Tailwind CSS
* Docker
* PostgreSQL
* Render
* Vercel


