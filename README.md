# 🛍️ ShopVerse — Full-Stack E-Commerce Application

<div align="center">

![ShopVerse Banner](https://img.shields.io/badge/ShopVerse-E--Commerce-6c63ff?style=for-the-badge&logo=shopping-cart&logoColor=white)

[![Java](https://img.shields.io/badge/Java-24-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

A modern, full-stack e-commerce platform with JWT authentication, product management, shopping cart, order tracking, and an admin dashboard — built with Spring Boot + React.

</div>

---

## 📸 Features

| Feature | Description |
|--------|-------------|
| 🔐 **JWT Authentication** | Secure register/login with role-based access control |
| 🛍️ **Product Browsing** | Category filtering, search, product details |
| 🛒 **Shopping Cart** | Add, update quantity, remove items |
| 📦 **Order Management** | Place orders, track order history |
| 👨‍💼 **Admin Dashboard** | Stats overview, manage products & order statuses |
| 🌑 **Dark Premium UI** | Glassmorphism design with smooth animations |
| 📱 **Responsive** | Works on desktop and mobile |
| 🌱 **Auto Data Seeding** | Admin account + 13 products seeded on first run |

---

## 🏗️ Tech Stack

### Backend
- **Java 21+** (tested with Java 24)
- **Spring Boot 3.3.5** — REST API
- **Spring Security** — authentication & authorization
- **JJWT 0.12.6** — JWT token generation & validation
- **Spring Data MongoDB** — database access layer
- **MongoDB 8.x** — NoSQL document database
- **Maven** — build tool

### Frontend
- **React 18** with Vite
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Bootstrap 5** — base grid & utilities
- **React Toastify** — notifications
- **React Icons** — icon library
- **Custom CSS** — dark glassmorphism design system

---

## 📁 Project Structure

```
E-Commerece/
├── backend/                            # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/ecommerce/
│       ├── EcommerceApplication.java
│       ├── config/
│       │   └── DataSeeder.java         # Auto-seeds admin + sample data
│       ├── model/                      # MongoDB document models
│       │   ├── User.java
│       │   ├── Product.java
│       │   ├── Category.java
│       │   ├── Cart.java / CartItem.java
│       │   ├── Order.java / OrderItem.java
│       │   └── Role.java
│       ├── repository/                 # Spring Data MongoDB repos
│       ├── security/                   # JWT filter + Security config
│       │   ├── JwtUtil.java
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── SecurityConfig.java
│       │   └── UserDetailsServiceImpl.java
│       ├── dto/                        # Request/Response DTOs
│       ├── service/                    # Business logic
│       └── controller/                 # REST endpoints
│
├── frontend/                           # React (Vite) app
│   └── src/
│       ├── services/api.js             # Axios + JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx         # Global auth state
│       │   └── CartContext.jsx         # Global cart state
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── PrivateRoute.jsx
│       │   └── AdminRoute.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrderHistoryPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminProducts.jsx
│       │       └── AdminOrders.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css                   # Full dark theme design system
│
├── start-mongodb.bat                   # Start MongoDB
├── start-backend.bat                   # Start Spring Boot
└── start-frontend.bat                  # Start React dev server
```

---

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 21+ | [Download](https://www.oracle.com/java/technologies/downloads/) |
| Maven | 3.9+ | [Download](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [Download](https://nodejs.org/) |
| MongoDB | 7+ | [Download](https://www.mongodb.com/try/download/community) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/E-Commerece.git
cd E-Commerece
```

### 2. Start MongoDB

**Option A — If MongoDB is installed as a service:**
```bash
# Windows
net start MongoDB

# macOS / Linux
sudo systemctl start mongod
```

**Option B — Run manually:**
```bash
mongod --dbpath /path/to/data/db --port 27017
```

### 3. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**.  
On first run it automatically seeds:
- ✅ Admin account: `admin@ecommerce.com` / `Admin@123`
- ✅ 5 categories (Electronics, Clothing, Books, Sports, Home & Kitchen)
- ✅ 13 products with images

### 4. Start the Frontend

```bash
cd frontend
npm install       # first time only
npm run dev
```

The frontend will start on **http://localhost:5173**.

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@ecommerce.com` | `Admin@123` |
| **Customer** | Register at `/register` | Your choice (min 6 chars) |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login → returns JWT |
| GET | `/api/auth/me` | User | Get current user info |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List all products (with `?categoryId=` & `?search=`) |
| GET | `/api/products/{id}` | Public | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| POST | `/api/categories` | Admin | Create category |

### Cart
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cart` | User | Get user's cart |
| POST | `/api/cart/add` | User | Add item to cart |
| PUT | `/api/cart/update/{itemId}?quantity=N` | User | Update item quantity |
| DELETE | `/api/cart/remove/{itemId}` | User | Remove item |
| DELETE | `/api/cart/clear` | User | Clear entire cart |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User | Place order from cart |
| GET | `/api/orders` | User | Get order history |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/{id}/status?status=X` | Admin | Update order status |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |

---

## 🔧 Configuration

Backend config is in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties):

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/ecommerce_db

# JWT
app.jwt.secret=your-256-bit-secret-key
app.jwt.expiration=86400000

# Server
server.port=8080
```

Frontend API base URL is in [`frontend/src/services/api.js`](frontend/src/services/api.js):

```js
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🛒 Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
                    ↘
                  CANCELLED
```

Admins can update status from the **Admin → Orders** page.

---

## 🧪 Testing with Postman

1. **Register/Login:**
```json
POST http://localhost:8080/api/auth/login
{
  "email": "admin@ecommerce.com",
  "password": "Admin@123"
}
```

2. Copy the `token` from the response.

3. Add to all protected requests:
```
Authorization: Bearer <your-token>
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Connection refused: 27017` | MongoDB is not running — start it first |
| `mvn: command not found` | Add Maven `bin/` to your PATH |
| Frontend can't reach API | Confirm backend is on port 8080, check CORS |
| `Cannot find symbol` compile error | Ensure you're using Java 21+ |
| Port 8080 already in use | `netstat -ano \| findstr :8080` then kill the PID |
| Port 5173 already in use | `npm run dev -- --port 3000` |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Srujan** — [GitHub](https://github.com/SRUJAN506)

---

<div align="center">

Made with ❤️ using Spring Boot + React + MongoDB

⭐ **Star this repo if you found it helpful!** ⭐

</div>
