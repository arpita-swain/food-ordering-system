# FoodieGo Backend — FastAPI + SQLAlchemy + MySQL

High-performance, production-structured REST API backend for the **FoodieGo Online Food Ordering System**. This backend is built to serve the React + Vite frontend with JWT authentication, role-based access control, MySQL 8+ persistence, and transactional order processing.

---

## 1. Project Overview

The FoodieGo backend manages:
- **Authentication & RBAC**: JWT Bearer tokens for Customers, Delivery Partners, and Admins.
- **Restaurant & Menu Catalog**: Rich multi-attribute search, category filtering, vegetarian filters, and sorting.
- **Cart & Coupon Engine**: Server-side coupon verification enforcing minimum order constraints and discount caps.
- **Order Lifecycle**: Recalculates item prices and taxes, manages atomic order creation with snapshot pricing, and tracks live step-by-step progress (`Placed` -> `Confirmed` -> `Preparing` -> `Out for Delivery` -> `Delivered`).
- **Payments**: Razorpay/Stripe session initialization and transaction signature verification.
- **Reviews & Ratings**: Post-delivery multi-criteria reviews dynamically updating restaurant ratings.

---

## 2. Technology Stack

- **Language & Framework**: Python 3.10+, FastAPI 0.110+, Uvicorn
- **ORM & Database**: SQLAlchemy 2.0+, MySQL 8+, PyMySQL driver
- **Data Validation & Settings**: Pydantic v2, Pydantic Settings
- **Security & Cryptography**: Passlib (Bcrypt), Python-JOSE (JWT tokens)
- **Testing**: Pytest, HTTPX

---

## 3. Backend Folder Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entry & CORS middleware
│   ├── core/
│   │   ├── config.py               # Pydantic environment & app settings
│   │   ├── security.py             # Bcrypt hashing & JWT encode/decode
│   │   └── dependencies.py         # JWT dependencies & RBAC guards
│   ├── database/
│   │   ├── connection.py           # Engine pool, SessionLocal, get_db()
│   │   ├── base.py                 # SQLAlchemy DeclarativeBase
│   │   └── init_db.py              # Schema creation script
│   ├── models/
│   │   ├── user.py                 # Users & roles
│   │   ├── address.py              # Delivery addresses
│   │   ├── restaurant.py           # Restaurants & hours
│   │   ├── category.py             # Food categories
│   │   ├── food.py                 # Menu dishes & customizations
│   │   ├── coupon.py               # Discount vouchers
│   │   ├── order.py                # Orders & pricing
│   │   ├── order_item.py           # Order items with price snapshot
│   │   ├── order_status_history.py # Tracking audit log
│   │   ├── payment.py              # Payment transactions
│   │   ├── review.py               # Customer reviews
│   │   └── favorite.py             # User favorites
│   ├── schemas/
│   │   ├── auth.py                 # Auth request/response DTOs
│   │   ├── user.py                 # User DTOs
│   │   ├── address.py              # Address DTOs
│   │   ├── restaurant.py           # Restaurant DTOs
│   │   ├── category.py             # Category DTOs
│   │   ├── food.py                 # Food DTOs
│   │   ├── coupon.py               # Coupon DTOs
│   │   ├── order.py                # Order & pricing DTOs
│   │   ├── payment.py              # Payment gateway DTOs
│   │   └── review.py               # Review DTOs
│   ├── routers/
│   │   ├── auth.py                 # /api/v1/auth
│   │   ├── users.py                # /api/v1/users & addresses
│   │   ├── restaurants.py          # /api/v1/restaurants
│   │   ├── categories.py           # /api/v1/categories
│   │   ├── foods.py                # /api/v1/foods
│   │   ├── coupons.py              # /api/v1/coupons
│   │   ├── orders.py               # /api/v1/orders
│   │   ├── payments.py             # /api/v1/payments
│   │   ├── favorites.py            # /api/v1/favorites
│   │   └── admin.py                # /api/v1/admin
│   ├── services/
│   │   ├── auth_service.py         # Registration & login logic
│   │   ├── restaurant_service.py   # Catalog query & filters
│   │   ├── food_service.py         # Menu management
│   │   ├── coupon_service.py       # Discount calculation logic
│   │   ├── order_service.py        # Transactional order placement
│   │   └── payment_service.py      # Gateway session & verification
│   └── utils/
│       └── helpers.py              # ID generator & currency helpers
├── scripts/
│   ├── seed_data.py                # Initial database seed script
│   └── create_admin.py             # Admin account provisioner
├── tests/
│   ├── test_auth.py
│   ├── test_restaurants.py
│   ├── test_foods.py
│   └── test_orders.py
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 4. MySQL Installation

### macOS (Homebrew):
```bash
brew install mysql
brew services start mysql
```

### Ubuntu / Debian Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Windows:
Download and run the **MySQL Installer** from MySQL official downloads (choose Developer Default or Server Only with MySQL Workbench).

---

## 5. Database Creation

Open your MySQL terminal or client and execute:

```sql
CREATE DATABASE foodiego_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Verify the database:
```sql
SHOW DATABASES;
```

---

## 6. Environment Configuration (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your configuration values:

```env
APP_NAME=FoodieGo Backend
APP_ENV=development
DEBUG=true

HOST=0.0.0.0
PORT=8000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
MYSQL_DATABASE=foodiego_db

DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/foodiego_db?charset=utf8mb4

JWT_SECRET_KEY=foodiego_super_secret_jwt_key_2026_production_grade_32_chars
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

FRONTEND_URL=http://localhost:5173
```

---

## 7. Database Connection Architecture

Managed inside `app/database/connection.py`:
- SQLAlchemy connection engine configured with `pool_size=10`, `max_overflow=20`, `pool_recycle=3600`, and `pool_pre_ping=True`.
- Requests access the database through FastAPI's dependency injection via `get_db()`.
- Sessions are automatically closed in `finally` blocks, preventing connection leaks.

---

## 8. Table Structure & 9. Relationships

- **users**: Primary user accounts (`Customer`, `Delivery Partner`, `Admin`).
- **addresses**: Delivery addresses linked `1:N` to `users`.
- **restaurants**: Partner eateries with geo coordinates, opening hours, and ratings.
- **categories**: Cuisine categories (`Biryani`, `Burgers`, `Pizza`, etc.).
- **food_items**: Dishes linked `N:1` to `restaurants`, with JSON customizations.
- **coupons**: Voucher codes with `fixed` or `percent` discount rules.
- **orders**: Comprehensive order ledger linked to `users` and `restaurants`.
- **order_items**: Item line entries with frozen price snapshots at purchase time.
- **order_status_history**: Audit trail of order status updates.
- **payments**: Transaction log storing gateway transaction IDs and payment status.
- **reviews**: Verified customer ratings linked to `orders`, `restaurants`, and `users`.
- **favorites**: User bookmarked restaurants and dishes.

---

## 10. Authentication & 11. JWT

- **Registration**: `POST /api/v1/auth/register` hashes passwords with bcrypt and returns a signed JWT.
- **Login**: `POST /api/v1/auth/login` checks credentials and issues a JWT token.
- **Protected Endpoints**: The React frontend passes the JWT header:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- Reusable security dependencies:
  - `get_current_user`
  - `require_admin`
  - `require_delivery_partner`
  - `require_customer`

---

## 12. Default Demo Credentials

Pre-seeded via `scripts/seed_data.py`:

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@foodiego.com` | `password123` |
| **Delivery Partner** | `delivery@foodiego.com` | `password123` |
| **Admin** | `admin@foodiego.com` | `password123` |

---

## 13. API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | MySQL connection health status | Public |
| `POST` | `/api/v1/auth/register` | Register new user | Public |
| `POST` | `/api/v1/auth/login` | Login and get JWT | Public |
| `GET` | `/api/v1/auth/me` | Current user profile | Bearer Token |
| `POST` | `/api/v1/auth/otp/send` | Send SMS OTP | Public |
| `POST` | `/api/v1/auth/otp/verify` | Verify SMS OTP | Public |
| `GET` | `/api/v1/restaurants` | List restaurants (filters & sorting) | Public |
| `GET` | `/api/v1/restaurants/{id}` | Get restaurant details | Public |
| `POST` | `/api/v1/restaurants` | Create restaurant | Admin |
| `PUT` | `/api/v1/restaurants/{id}` | Update restaurant | Admin |
| `DELETE` | `/api/v1/restaurants/{id}` | Delete restaurant | Admin |
| `GET` | `/api/v1/categories` | List categories | Public |
| `GET` | `/api/v1/foods` | List food items (filters) | Public |
| `GET` | `/api/v1/foods/{id}` | Get food item | Public |
| `POST` | `/api/v1/foods` | Create food item | Admin |
| `PUT` | `/api/v1/foods/{id}` | Update food item | Admin |
| `DELETE` | `/api/v1/foods/{id}` | Delete food item | Admin |
| `GET` | `/api/v1/coupons` | List available coupons | Public |
| `POST` | `/api/v1/coupons/validate` | Validate coupon against cart total | Public |
| `POST` | `/api/v1/coupons` | Create coupon voucher | Admin |
| `GET` | `/api/v1/users/addresses` | List user addresses | Bearer Token |
| `POST` | `/api/v1/users/addresses` | Add delivery address | Bearer Token |
| `DELETE` | `/api/v1/users/addresses/{id}` | Delete delivery address | Bearer Token |
| `PATCH` | `/api/v1/users/addresses/{id}/default` | Set default address | Bearer Token |
| `POST` | `/api/v1/orders` | Place order (transactional recalculation) | Optional/Bearer |
| `GET` | `/api/v1/orders` | List orders (role-filtered) | Optional/Bearer |
| `GET` | `/api/v1/orders/{id}` | Get order details & tracking | Optional/Bearer |
| `PATCH` | `/api/v1/orders/{id}/status` | Update delivery tracking status | Optional/Bearer |
| `POST` | `/api/v1/orders/{id}/rating` | Rate and review delivered order | Optional/Bearer |
| `POST` | `/api/v1/payments/create-session` | Initialize gateway session | Public |
| `POST` | `/api/v1/payments/verify` | Verify payment signature | Public |
| `GET` | `/api/v1/favorites` | Get user favorite IDs | Bearer Token |
| `POST` | `/api/v1/favorites/restaurants/{id}` | Toggle restaurant favorite | Bearer Token |
| `POST` | `/api/v1/favorites/foods/{id}` | Toggle food favorite | Bearer Token |
| `GET` | `/api/v1/admin/stats` | Admin dashboard analytics | Admin |

---

## 14. Request & Response Examples

### Register User
`POST /api/v1/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 00000",
  "password": "securepassword",
  "role": "Customer"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-17290001",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 98765 00000",
    "role": "Customer",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    "ordersCount": 0,
    "status": "Active"
  }
}
```

### Validate Coupon
`POST /api/v1/coupons/validate`
```json
{
  "code": "SAVE50",
  "cartTotal": 299.0
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "coupon": {
    "id": "cpn-1",
    "code": "SAVE50",
    "description": "Get ₹50 OFF on orders above ₹199",
    "discountType": "fixed",
    "discountAmount": 50.0,
    "minOrder": 199.0,
    "maxDiscount": 50.0,
    "badge": "Popular",
    "expiry": "Valid till 31 Oct 2026",
    "isActive": true
  },
  "discount": 50.0,
  "message": "Coupon SAVE50 applied successfully! You saved ₹50"
}
```

### Create Order
`POST /api/v1/orders`
```json
{
  "restaurantId": "rest-1",
  "restaurantName": "Spice Garden Royal",
  "restaurantAddress": "Near Grand Mall, Main High Road, Dantan",
  "items": [
    {
      "id": "food-101",
      "name": "Chicken Dum Biryani",
      "price": 249.0,
      "quantity": 2,
      "size": "Regular (Serves 1)",
      "extras": ["Extra Boiled Egg"]
    }
  ],
  "deliveryOption": "standard",
  "specialInstructions": "Call on arrival",
  "deliveryAddress": {
    "name": "Arpit Sinha",
    "phone": "+91 98765 43210",
    "type": "Home",
    "addressLine": "Flat 4B, Sunrise Enclave, Station Road, Dantan",
    "lat": 21.9540,
    "lng": 87.2720
  },
  "payment": {
    "method": "UPI",
    "status": "Paid",
    "transactionId": "TXN_UPI_98231"
  }
}
```

---

## 15. Transactional Order Calculation

When an order is submitted:
1. Validates restaurant and food IDs in MySQL.
2. Reads current database item prices (immune to frontend tampering).
3. Computes subtotal, dynamic delivery fees, ₹5 platform fee, 5% GST taxes, delivery tip, and validated coupon discount.
4. Generates an atomic transaction:
   - Order record created
   - Line items created with snapshot prices
   - Payment record created
   - Initial status history step appended (`Placed`)
5. Commits atomically. If any step fails, rollbacks everything.

---

## 16. Step-by-Step Setup Guide

### Step 1: Create Virtual Environment
```bash
cd backend
python -m venv .venv
```
Activate environment:
- **macOS / Linux**: `source .venv/bin/activate`
- **Windows (PowerShell)**: `.venv\Scripts\Activate.ps1`
- **Windows (CMD)**: `.venv\Scripts\activate.bat`

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Initialize Database Schema
```bash
python -m app.database.init_db
```

### Step 4: Seed Database
```bash
python scripts/seed_data.py
```

### Step 5: Start FastAPI Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 17. Connecting the React Frontend

In the root frontend directory, point `.env` or set `VITE_API_URL`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the frontend Vite dev server:
```bash
npm run dev
```

The frontend Axios client (`src/api/client.js`) will send all requests directly to `http://localhost:8000/api/v1` with your JWT tokens attached.

---

## 18. Interactive API Documentation

Once the server is running:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 19. Running Automated Tests

```bash
cd backend
pytest -v
```
