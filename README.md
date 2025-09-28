# Sweet Shop Management System – Backend

A **Node.js + TypeScript + Express + Prisma** backend for managing a sweet shop.  
Includes authentication, sweets management (CRUD), customer purchases, and admin restocking.  
Follows **TDD (Test-Driven Development)** with Jest + Supertest.  

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL (via Prisma ORM)  
- **Auth:** JWT (JSON Web Token)  
- **Validation:** Zod  
- **Testing:** Jest + Supertest  

---

## Project Structure

backend/
├── src/
│   ├── app.ts              # Express app
│   ├── routes/             # Route definitions
│   ├── controllers/        # Controller logic
│   ├── middlewares/        # JWT + Role auth
│   ├── prisma/             # Prisma client
│   ├── schemas/            # Zod validations
│   └── tests/              # Jest + Supertest tests
└── prisma/
└── schema.prisma       # DB Models

---

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