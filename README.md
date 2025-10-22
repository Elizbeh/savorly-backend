🧩 README for `savorly-backend`
-------------------------------

`# 🍳 Savorly Backend

Savorly Backend is the secure API powering **Savorly**, a full-stack recipe management web application.
It provides all backend logic --- authentication, user roles, recipe CRUD, image uploads, email verification, saved recipes, and more --- built with **Node.js**, **Express**, and **MySQL (TiDB)**.

The API is deployed on **Render**, with a fully automated **CI/CD pipeline via GitHub Actions**.

---

## 🚀 Live API

**Base URL:** [https://savorly-backend.onrender.com](https://savorly-backend.onrender.com)

---

## 🧱 Architecture Overview

```text
savorly-backend/
├── config/
│   ├── db.js                # MySQL/TiDB connection pool
│   ├── logger.js            # Winston logger configuration
│
├── controllers/             # Core business logic
│   ├── authController.js
│   ├── loginController.js
│   ├── verifyEmailController.js
│   ├── recipeController.js
│   ├── profileController.js
│   ├── categoryController.js
│   ├── savedRecipesController.js
│   └── adminController.js
│
├── middleware/
│   ├── authenticate.js      # JWT auth + secure cookies
│   ├── isAdmin.js           # Role-based access control
│   ├── upload.js            # Cloudinary upload handler
│   └── validateInput.js     # Joi input validation
│
├── models/                  # Database query logic
│   ├── userModel.js
│   ├── recipeModel.js
│   ├── categoryModel.js
│   ├── commentModel.js
│   └── ratingModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── recipeRoutes.js
│   ├── categoryRoutes.js
│   ├── profileRoutes.js
│   └── savedRecipeRoutes.js
│
├── migrations/              # Migration and seeding scripts
│   ├── runMigrations.js
│   └── seedDatabase.js
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── server.js                # Express app entry point
└── package.json `

* * * * *

⚙️ Core Features
----------------

✅ **Secure Authentication**

-   JWT-based login/register

-   Secure cookies for refresh tokens

-   Email verification with token system

-   Rate-limiting on login and registration

✅ **User Management**

-   CRUD operations for users (admin-restricted)

-   Role management (user/admin promotion)

✅ **Recipe Management**

-   Create, read, update, and delete recipes

-   Cloudinary image upload (via Multer & Streamifier)

-   Comment and rating features

✅ **Profile & Saved Recipes**

-   Manage profile (bio, avatar)

-   Save and unsave recipes

-   View saved recipes

✅ **Security**

-   `helmet`, `xss-clean`, `express-rate-limit` middleware

-   Sanitized SQL queries (using `mysql2` prepared statements)

-   HTTPS-only cookies in production

-   Password hashing via `bcryptjs`

✅ **Automated Database Setup**

-   Migrations and seeders for TiDB/MySQL

-   Auto-creation of the database in CI/CD workflow

✅ **Testing**

-   `jest` + `supertest` for unit and integration testing

✅ **CI/CD on GitHub Actions**

-   Builds, tests, migrates, and deploys automatically to Render

-   Secure use of GitHub Secrets for environment variables

* * * * *

🧪 CI/CD Pipeline
-----------------

GitHub Actions workflow runs on every push to the `master` branch:

-   ✅ Checkout code

-   ⚙️ Set up Node.js (v18)

-   💾 Install dependencies

-   🛠️ Create database if not exists

-   🔄 Run migrations & seed data

-   🧪 Execute unit and integration tests

-   🚀 Deploy automatically to **Render**

See workflow file: `.github/workflows/backend-ci.yml`

* * * * *

🛠️ Local Development
---------------------

### 1️⃣ Clone the repo

`git clone https://github.com/Elizbeh/savorly-backend.git
cd savorly-backend`

### 2️⃣ Install dependencies

`npm install`

### 3️⃣ Configure environment

Create a `.env` file in the project root:

`NODE_ENV=development
PORT=8080
DB_HOST=your-tidb-host
DB_PORT=4000
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=savorly
JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://Elizbeh.github.io/savorly-end`

### 4️⃣ Run migrations & seed data

`npm run migrate
npm run seed`

### 5️⃣ Start development server

`npm run dev`

Your API will be available at\
👉 `http://localhost:8080`

* * * * *

🧩 API Routes Overview
----------------------

| Endpoint | Method | Description | Auth |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login and receive token | No |
| `/api/auth/verify-email` | GET | Email verification | No |
| `/api/auth/user` | GET | Get logged user | ✅ |
| `/api/recipes` | GET | Get all recipes | No |
| `/api/recipes/create` | POST | Create a recipe | ✅ |
| `/api/profile` | GET/PUT | Get or update profile | ✅ |
| `/api/saved` | GET/POST/DELETE | Manage saved recipes | ✅ |
| `/api/categories` | GET/POST | Fetch or create category | ✅ (POST admin) |
| `/api/admin/users` | GET/DELETE/PUT | Manage users | ✅ (admin only) |

* * * * *

🧰 Tech Stack
-------------

-   **Backend:** Node.js, Express.js

-   **Database:** MySQL / TiDB

-   **Auth:** JWT + Secure Cookies

-   **Storage:** Cloudinary (image uploads)

-   **Email:** Nodemailer (verification emails)

-   **Testing:** Jest, Supertest

-   **Security:** Helmet, XSS-Clean, Rate-Limit

-   **Logging:** Winston

-   **CI/CD:** GitHub Actions + Render

* * * * *

🧑‍💻 Author
------------

**Elizabeth [@Elizbeh](https://github.com/Elizbeh)**\
Full-Stack Developer | Focused on secure, scalable web apps.\
📧 Contact: *available upon request*

* * * * *

📜 License
----------

This project is licensed under the **MIT License**.

* * * * *

> 💡 *This backend forms part of the full Savorly web application, with the frontend built in React and hosted on GitHub Pages.*
>
> 🔗 Frontend: https://Elizbeh.github.io/savorly-frontend