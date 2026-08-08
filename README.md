# 🍳 Savorly Backend

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=githubactions)
![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

A secure, production-ready REST API powering **Savorly**, a full-stack recipe sharing application.

The backend is built with **Node.js**, **Express.js**, and **MySQL (TiDB)** and follows modern DevOps practices including:

- 🐳 Docker containerization
- ⚙️ GitHub Actions CI/CD
- 🧪 Automated testing
- 🗄️ Automated database migrations
- 📦 Docker image publishing to GitHub Container Registry (GHCR)
- ☁️ Production deployment on Render

---

# 🚀 Live Application

### Backend API

https://savorly.duckdns.org

### Frontend

https://elizbeh.github.io/savorly-frontend

---

# 🏗️ Architecture

```
                      Developer
                           │
                     Push to GitHub
                           │
                           ▼
                  GitHub Actions CI/CD
                           │
      ┌────────────────────┼─────────────────────┐
      │                    │                     │
      ▼                    ▼                     ▼
 Run Database        Run Unit &           Build Docker
  Migrations      Integration Tests          Image
      │                    │                     │
      └────────────────────┴─────────────────────┘
                           │
                           ▼
             GitHub Container Registry (GHCR)
                           │
                           ▼
                     Production Deployment
                           │
                           ▼
                         Render
```

---

# 🐳 Docker Architecture

The application can be started locally using Docker Compose.

```
                Docker Compose

        ┌────────────────────────┐
        │        Backend         │
        │  Node.js + Express API │
        └──────────┬─────────────┘
                   │
                   │
        ┌──────────▼─────────────┐
        │       MySQL 8          │
        │     Database           │
        └────────────────────────┘

        ┌────────────────────────┐
        │ Migration Container    │
        │ npm run migrate        │
        └────────────────────────┘
```

The migration container initializes the database before the backend starts.

---

# 📁 Project Structure

```
savorly-backend/
│
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── routes/
├── services/
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── docker-compose.yml
├── server.js
└── package.json
```

---

# ✨ Features

## Authentication

- JWT Authentication
- Refresh Tokens
- Secure Cookies
- Email Verification
- Password Hashing (bcrypt)

---

## Recipe Management

- Create recipes
- Update recipes
- Delete recipes
- Recipe categories
- Ingredients
- Image upload with Cloudinary

---

## User Features

- User profiles
- Saved recipes
- Ratings
- Comments

---

## Security

- Helmet
- Express Rate Limit
- XSS Protection
- Joi Validation
- Secure Cookies
- Parameterized SQL Queries

---

## Database

- MySQL / TiDB
- Automated Migrations
- Database Seeding
- Connection Pooling

---

## Logging

- Winston Logger
- Structured Logging
- Error Logging

---

# 🧪 Testing

Testing is fully automated using:

- Jest
- Supertest

The pipeline executes:

- Unit Tests
- Integration Tests

before any Docker image is published.

---

# ⚙️ CI/CD Pipeline

Every push to **master** or **dev** automatically triggers GitHub Actions.

The workflow performs the following:

```
Checkout Repository
        │
        ▼
Install Dependencies
        │
        ▼
Start MySQL Service
        │
        ▼
Run Database Migrations
        │
        ▼
Run Unit Tests
        │
        ▼
Run Integration Tests
        │
        ▼
Build Docker Image
        │
        ▼
Publish Image to GitHub Container Registry
```

Docker images are versioned using:

- `latest`
- Commit SHA

Example:

```
ghcr.io/elizbeh/savorly-backend:latest
```

---

# 🐳 Running Locally with Docker

Build and start the application

```bash
docker compose up --build
```

This starts:

- MySQL
- Migration Service
- Backend API

Stop containers

```bash
docker compose down
```

---

# 💻 Local Development

Clone the repository

```bash
git clone https://github.com/Elizbeh/savorly-backend.git

cd savorly-backend
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
NODE_ENV=development
PORT=5001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=savorly_db

JWT_SECRET=your_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

EMAIL_USER=your_email

EMAIL_PASS=your_password

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Run migrations

```bash
npm run migrate
```

(Optional)

Seed database

```bash
npm run seed
```

Run server

```bash
npm run dev
```

---

# 📦 Docker Image

Every successful CI build publishes a Docker image to GitHub Container Registry.

Container Registry:

```
ghcr.io/elizbeh/savorly-backend
```

---

# 📚 API Overview

| Endpoint | Method | Description |
|-----------|---------|------------|
| /api/auth/register | POST | Register user |
| /api/auth/login | POST | Login |
| /api/auth/verify-email | GET | Verify email |
| /api/recipes | GET | Retrieve recipes |
| /api/recipes/create | POST | Create recipe |
| /api/profile | GET / PUT | User profile |
| /api/categories | GET / POST | Categories |
| /api/saved | GET / POST | Saved recipes |
| /api/admin/users | GET / PUT / DELETE | User administration |

---

# 🛠️ Technology Stack

### Backend

- Node.js
- Express.js

### Database

- MySQL
- TiDB Cloud

### Authentication

- JWT
- Cookies

### Storage

- Cloudinary

### Email

- Nodemailer

### Testing

- Jest
- Supertest

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry
- Render

### Security

- Helmet
- XSS Clean
- Express Rate Limit
- Joi

### Logging

- Winston

---

# 🔗 Related Repositories

### Frontend

https://github.com/Elizbeh/savorly-frontend

### Original Full Project Documentation

https://github.com/Elizbeh/Savorly

---

# 👩‍💻 Author

**Elizabeth Behaghel**

Full-Stack Developer transitioning into **Cloud & DevOps Engineering**.

GitHub:

https://github.com/Elizbeh

---

# 📄 License

MIT License.

---

## ⭐ Future Improvements

- Kubernetes deployment
- Infrastructure as Code (Terraform)
- Monitoring with Prometheus & Grafana
- Docker image vulnerability scanning
- Automated cloud deployment
- Blue/Green deployments

---

> This project demonstrates modern backend development practices combined with containerization, CI/CD automation, automated testing, and cloud deployment, making it suitable as a portfolio project for Full-Stack and Junior DevOps roles.
> 🔗 Frontend: https://Elizbeh.github.io/savorly-frontend