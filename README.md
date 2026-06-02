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

A modern, full‑stack **Inventory & Order Management** SaaS platform built for small and medium businesses.  
Manage products, customers, orders, and inventory levels with a clean, responsive interface and powerful business automation.

## 🌐 Live Application

| Service       | URL                                                      |
|---------------|----------------------------------------------------------|
| **Frontend**  | [https://stockflow-pro-rho.vercel.app](https://stockflow-pro-rho.vercel.app) |
| **Backend API** | [https://stockflow-backend-r0re.onrender.com](https://stockflow-backend-r0re.onrender.com) |
| **Swagger Docs** | [https://stockflow-backend-r0re.onrender.com/docs](https://stockflow-backend-r0re.onrender.com/docs) |
| **Docker Hub** | `adityaiitbhu26/stockflow-backend:latest` |

---

## 🚀 What is StockFlow Pro?

StockFlow Pro helps businesses **track inventory, process customer orders, and monitor operational performance** from a centralised dashboard.  
It automatically calculates order totals, reduces stock when orders are placed, prevents overselling, and restores stock when orders are cancelled.

Built with a production‑grade tech stack and deployed on free cloud platforms, it demonstrates real‑world software engineering practices.

---

## 🎯 Target Users

- **Retail stores** – manage physical product inventory and walk‑in orders.
- **E‑commerce sellers** – keep online product listings in sync with actual stock.
- **Wholesalers** – handle bulk orders and track customer relationships.
- **Warehouse staff** – monitor low‑stock alerts and fulfil orders.
- **Business owners** – view revenue, top‑selling products, and customer trends.

---

## ✨ Core Features

### 📦 Product Management
- Add, edit, delete products with **name, SKU, description, category, price, and stock quantity**.
- **Unique SKU enforcement** – prevents duplicate identifiers.
- **Price must be > 0**, **quantity cannot be negative** – validated on backend.
- **Search** by name or SKU, **filter by category**, **sort** by name, price, stock, or date.
- **CSV Import** – bulk‑upload products from a CSV file (validates duplicates).
- **CSV Export** – download product list as a spreadsheet.
- **Bulk delete** – select multiple products and remove them in one click.
- **Low‑stock visual alerts** (red highlight when quantity ≤ 5).

### 👥 Customer Management
- Add, search, and delete customers with **full name, email, phone, and address**.
- **Unique email validation** on the backend.
- **Phone validation** ensures correct format.
- **Customer Order History** – click the cart icon next to a customer to see all their orders (filtered automatically).

### 🛒 Order Management
- Create orders by selecting a customer and one or more products.
- **Inventory validation** – order is rejected if quantity exceeds available stock.
- **Automatic total calculation** on the backend.
- **Stock automatically decreases** when an order is placed (atomic transaction).
- **Order status workflow**: Pending → Confirmed → Processing → Completed.
- **Cancel orders** – stock is restored instantly.
- **Filter orders** by status and **date range**.
- **Sortable columns** (ID, customer, total, date).
- **CSV Export** of order list.
- **PDF Invoice** – generate a professional invoice with one click.
- **Print Invoice** – browser‑native print layout for physical copies.

### 📊 Dashboard & Analytics
- **Summary cards**: Total Products, Total Customers, Total Orders, Total Revenue.
- **Revenue Trend** bar chart – daily revenue aggregated from orders.
- **Order Status Breakdown** – interactive pie chart.
- **Top Selling Products** and **Top Customers** lists.
- **Low‑Stock Products** & **Out‑of‑Stock Products** tables.
- **Recent Orders** with status badges.

### ⚙️ Additional Production Features
- **Dark mode** toggle – preference saved locally.
- **Notifications bell** in header – shows count of low‑stock products; click to navigate to those items.
- **Profile page** – upload company logo and edit business information.
- **Delete confirmation dialogs** – prevents accidental deletions.
- **Responsive design** – works on desktop, tablet, and mobile.
- **Lazy loaded routes** for optimal frontend performance.

---

## 🏗️ Technical Architecture

### Backend (Python + FastAPI)
- **Clean Architecture**: Routes → Services → Repositories → Database
- **PostgreSQL** with SQLAlchemy ORM and Alembic migrations
- **Pydantic** request/response validation
- **Rate limiting** on all endpoints (via `slowapi`)
- **CORS** configured for frontend origin
- **Health check** endpoint (`/health`)
- **Structured JSON logging**
- **Atomic database transactions** for order creation and cancellation

### Frontend (React + Vite)
- **Tailwind CSS** with a custom Indigo/Slate palette
- **Shadcn‑inspired** reusable components (Button, Modal, Table, Badge, etc.)
- **React Query** for server state management (caching, refetching, optimistic updates)
- **React Hook Form** for form validation
- **React Router** with lazy loading
- **Recharts** for dashboard charts
- **jsPDF & html2canvas** for PDF invoice generation
- **react‑hot‑toast** for notifications

### DevOps & Deployment
- **Docker** – Backend and Frontend each have their own `Dockerfile` (multi‑stage builds)
- **Docker Compose** – runs PostgreSQL, Backend, and Frontend together with health checks and named volumes
- **GitHub Actions** – CI pipeline that builds the frontend on every push
- **Render** – hosts the backend Docker image
- **Vercel** – hosts the frontend (SPA rewrites configured)
- **Neon** – free PostgreSQL database (production)

---

## 📋 Business Rules Enforced

| Rule | Implementation |
|------|----------------|
| Product SKU must be unique | Backend validation + unique index in DB |
| Customer email must be unique | Backend validation + unique index |
| Price must be > 0 | Pydantic `gt=0` |
| Quantity cannot be negative | Pydantic `ge=0` |
| Order only if stock sufficient | Service layer checks before deduction |
| Order total calculated automatically | Backend computes `sum(price * qty)` |
| Inventory decreases on order | Atomic transaction: stock reduced & order created |
| Inventory restored on cancel | Cancelled order triggers stock increase |
| Valid HTTP status codes | 201 Created, 404 Not Found, 409 Conflict, 422 Validation, 500 Internal |

---

## 📡 API Endpoints (Base: `/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST`   | `/products/`              | Create product |
| `GET`    | `/products/`              | List products (search, filter, sort, paginate) |
| `GET`    | `/products/{id}`          | Get product by ID |
| `PUT`    | `/products/{id}`          | Update product |
| `DELETE` | `/products/{id}`          | Delete product |
| `POST`   | `/products/import`        | CSV import (multipart) |
| `POST`   | `/customers/`             | Create customer |
| `GET`    | `/customers/`             | List customers (search, sort, paginate) |
| `GET`    | `/customers/{id}`         | Get customer by ID |
| `DELETE` | `/customers/{id}`         | Delete customer |
| `POST`   | `/orders/`                | Create order |
| `GET`    | `/orders/`                | List orders (filter by status, date range, sort, paginate) |
| `GET`    | `/orders/{id}`            | Get order details (includes items) |
| `PUT`    | `/orders/{id}/status`     | Update order status |
| `DELETE` | `/orders/{id}`            | Cancel order |
| `GET`    | `/dashboard/`             | Dashboard analytics |

All responses follow a consistent structure:  
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
Pagination is included for list endpoints:

json
{
  "success": true,
  "data": [...],
  "page": 1,
  "limit": 20,
  "total": 42
}
🐳 Running Locally with Docker
Clone the repository

bash
git clone https://github.com/AdityaIITBHU26/stockflow-pro.git
cd stockflow-pro
Set up environment files

bash
cp backend/.env.example backend/.env
# (For local dev the defaults work, for production update DATABASE_URL)
Start all services

bash
docker compose up -d
Access

Frontend: http://localhost

Backend docs: http://localhost:8000/docs

Health check: http://localhost:8000/health

🧪 Testing
Backend: Pytest tests in backend/tests/ (currently skipped in CI to avoid DB dependency issues, but runnable locally with a test PostgreSQL instance).

Frontend: Components can be tested with React Testing Library (setup already present).

CI: GitHub Actions workflow builds the frontend on every push to ensure code integrity.

📁 Project Structure
text
stockflow-pro/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # Route handlers
│   │   ├── core/                # Config, security, logging
│   │   ├── db/                  # Database session and base model
│   │   ├── models/              # SQLAlchemy models
│   │   ├── repositories/        # Data access layer
│   │   ├── schemas/             # Pydantic request/response models
│   │   └── services/            # Business logic
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # Backend tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios API clients
│   │   ├── components/          # Reusable UI and layout components
│   │   ├── context/             # Theme and app context
│   │   ├── hooks/               # Custom React Query hooks
│   │   ├── pages/               # Page components (Dashboard, Products, etc.)
│   │   └── utils/               # CSV export, PDF invoice helpers
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
🙌 Acknowledgements
Built as a demonstration of full‑stack engineering skills using modern tools:
FastAPI, React, Tailwind CSS, Docker, PostgreSQL, Render, Vercel.

