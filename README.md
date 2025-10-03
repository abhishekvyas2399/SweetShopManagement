# Sweet Shop Management System

A full-stack sweet shop management system with **role-based dashboards**, built with **React + Redux Toolkit** on the frontend and **Node.js + Prisma + PostgreSQL** on the backend.

A **Node.js + TypeScript + Express + Prisma** backend for managing a sweet shop.  
Includes authentication, sweets management (CRUD), customer purchases, and admin restocking.  
Follows **TDD (Test-Driven Development)** with Jest + Supertest.  

##  Features

###  User Roles
- **Admin**
  - Full control over categories and sweets.
  - Manage inventory and stock.
- **Customer**
  - Browse available sweets.
  - Place orders (optional future feature).

---

###  Admin Dashboard

> URL: `/admin-dashboard`

-  **Role**: `ADMIN`
-  Access-controlled via JWT

#### Functionalities:
| Feature        | Description                                              |
|----------------|----------------------------------------------------------|
|  Add Category | Add a new category with a name.                          |
|  Add Sweet    | Add sweets with name, category, and price.              |
|  Edit Sweet   | Modify name, price, or category.                        |
|  Delete Sweet | Remove a sweet if not purchased (FK-safe).              |
|  Search Sweet | Filter sweets by name, category, or price.              |
|  Restock      | Update sweet quantity (optional/future).                |

---

### 👥 User Dashboard

 URL: `/user-dashboard`

 👤 **Role**: `CUSTOMER`

#### Functionalities:
| Feature     | Description                           |
|-------------|---------------------------------------|
|  View Sweets | View available sweets with filtering. |
|  Search    | Search sweets by name/category/price. |
|  Purchase  | purchase sweet with correct quantity   |

---
## Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL (via Prisma ORM)  
- **Auth:** JWT (JSON Web Token)  
- **Validation:** Zod  
- **Testing:** Jest + Supertest  


##  Technologies Used

| Frontend             | Backend              | Database     |
|----------------------|----------------------|--------------|
| React + TypeScript   | Node.js (Express)    | PostgreSQL   |
| Redux Toolkit (RTK)  | Prisma ORM           |              |
| Tailwind CSS         | JWT Auth             |              |
| Axios                | RESTful APIs         |              |

---

##  State Management with Redux

### Slices:
- `userData` → Auth info (token, user object)
- `sweets` → Sweet data (CRUD, search, loading)
- `categories` → Category data (CRUD)

---

##  Error Handling

-  Foreign key constraint (on delete) handled with **custom messages**
-  Token handling with proper validation & `useEffect` guards
-  Global loading/error states using `.addCase` and `.addMatcher` patterns in RTK



##  Setup

1. Clone repo & install dependencies:
    npm install
2. Create .env file:
    DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop"
    JWT_SECRET="yoursecret"
    PORT="portNumber"
3. Run Prisma migrations:
    npx prisma migrate dev
4. Start server:
    npm run dev
5. Run tests:
    npm test


API Routes
1. Auth
    POST /api/auth/register
	    •	Body JSON:
            {
            "name": "John",
            "email": "john@example.com",
            "password": "PassworD@1",
            }
	    •	Response: User object with token
            {
                "token": "jwt-token",
                "user": {
                    "id": "...",
                    "email": "john@example.com",
                    "role": "CUSTOMER"
                }
            }
    POST /api/auth/login
	    •	Body JSON:
            {
            "email": "john@example.com",
            "password": "PassworD@1"
            }
	•	Response:
	    •	Response: token
            {
                "token": "jwt-token",
                "user": {
                    "id": "...",
                    "email": "john@example.com",
                    "role": "CUSTOMER"
                }
            }


2. Sweets (Admin Only)
    POST /api/sweets
        •	Headers: Authorization: Bearer <admin_token>
        •	Body JSON:
                {
                    "name": "Kaju Katli",
                    "categoryId": 1,
                    "price": 250,
                    "description": "Delicious kaju sweet",
                    "quantity": 10
                }

    GET /api/sweets
        •	Headers: Authorization: Bearer <token>
        •	Response: List of sweets

    GET /api/sweets/search
        •	Query Params:
        •	name (string)
        •	category (number)
        •	price (number)
        •	Example:
    /api/sweets/search?name=Kaju&category=1&price=250

    PUT /api/sweets/:id
        •	Headers: Authorization: Bearer <admin_token>
        •	Params: id = sweet ID
        •	Body JSON:
        { "price": 300 }

    DELETE /api/sweets/:id
        •	Headers: Authorization: Bearer <admin_token>
        •	Params: id = sweet ID


3. Purchases (Customer Only)
    POST /api/sweets/:id/purchase
        •	Headers: Authorization: Bearer <customer_token>
        •	Params: id = sweet ID
        •	Body JSON:
        { "quantity": 2 }
    •	Response:
    Success → purchase record + updated stock
    Failure → “Out of stock” or “Insufficient stock”

4. Inventory (Admin Restock)
    POST /api/sweets/:id/restock
                •	Headers: Authorization: Bearer <admin_token>
                •	Params: id = sweet ID
                •	Body JSON:
            { "quantity": 5 }
    •	Response: updated sweet with new stock count