# 🍳 Savorly Backend

A secure, production-ready REST API powering **Savorly**, a full-stack recipe-sharing application.

The backend is built with **Node.js**, **Express.js**, and **MySQL**, and follows modern DevOps practices including:

* 🐳 Docker containerization
* ⚙️ GitHub Actions CI/CD
* 🧪 Automated unit and integration testing
* 🗄️ Automated database migrations
* 📦 Docker image publishing to GitHub Container Registry (GHCR)
* ☁️ Automated deployment to AWS EC2
* 🔄 Automatic deployment rollback on failed health checks
* 🔐 Environment-based configuration and secrets management
* 📊 Structured application logging

---

# 🚀 Live Application

### Frontend

https://elizbeh.github.io/savorly-frontend/

### Production API

https://savorly.duckdns.org

### API Health Check

https://savorly.duckdns.org/health

---

# 🏗️ Production Architecture

```text
                         Developer
                             │
                             │ git push
                             ▼
                      GitHub Repository
                             │
                             ▼
                    GitHub Actions CI/CD
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       Run Tests & DB                Build Docker Image
        Migrations                         │
              │                            ▼
              │                    GitHub Container
              │                       Registry
              │                            │
              └──────────────┬─────────────┘
                             │
                             ▼
                         AWS EC2
                             │
                             ▼
                    Docker Container
                    savorly-api :5000
                             │
                             ▼
                       Savorly API
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
                 MySQL           Cloudinary
               Database          Image Storage
```

---

# 🔄 CI/CD Pipeline

Every push to `master` or `dev` triggers the GitHub Actions pipeline.

The pipeline performs:

```text
Push to GitHub
      │
      ▼
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
Seed Test Database
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
Publish Image to GHCR
      │
      ▼
Deploy to AWS EC2
      │
      ▼
Pull Image by Commit SHA
      │
      ▼
Start New Container
      │
      ▼
Health Check
      │
      ├── PASS ──► Deployment Successful
      │
      └── FAIL ──► Automatic Rollback
```

### Deployment strategy

Production Docker images are tagged with the Git commit SHA:

```text
ghcr.io/elizbeh/savorly-backend:<commit-sha>
```

The `latest` tag is also published.

Using commit SHA tags makes deployments traceable and allows the previous production image to be restored automatically if a new deployment fails its health check.

---

# 🔄 Automatic Rollback

The production deployment includes a health-check-based rollback mechanism.

Before replacing the running container, the currently deployed image is saved.

After deployment:

```text
New container starts
       │
       ▼
GET /health
       │
   ┌───┴───┐
   │       │
  PASS    FAIL
   │       │
   ▼       ▼
Keep     Stop new
new      container
version      │
             ▼
        Restore previous
           image
             │
             ▼
        Health check
```

This prevents a broken Docker image from remaining in production.

---

# 🐳 Docker Architecture

Local development uses Docker Compose:

```text
              Docker Compose

       ┌────────────────────────┐
       │        Backend         │
       │  Node.js + Express API │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │        MySQL 8         │
       │       Database         │
       └────────────────────────┘

       ┌────────────────────────┐
       │   Migration Service    │
       │     npm run migrate    │
       └────────────────────────┘
```

The migration process initializes and updates the database schema before the application runs.

---

# 📁 Project Structure

```text
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
│
├── Dockerfile
├── docker-compose.yml
├── server.js
└── package.json
```

---

# ✨ Features

## Authentication

* JWT authentication
* Refresh tokens
* Secure HTTP cookies
* Email verification
* Password hashing with bcrypt

## Recipe Management

* Create recipes
* Update recipes
* Delete recipes
* Recipe categories
* Ingredients
* Image uploads with Cloudinary

## User Features

* User profiles
* Saved recipes
* Ratings
* Comments

---

# 🔐 Security

The API implements several security measures:

* Helmet security headers
* XSS protection
* Rate limiting
* Joi request validation
* Secure cookies
* JWT authentication
* Parameterized SQL queries
* CORS configuration
* Environment-based secrets

Production secrets are stored outside the repository and injected into the Docker container through environment configuration.

---

# 🗄️ Database

The backend uses MySQL with:

* Connection pooling
* Automated migrations
* Database seeding
* Test database isolation
* Migration checks for existing columns

Database migrations can be executed with:

```bash
npm run migrate
```

---

# 🧪 Testing

Testing is automated using:

* Jest
* Supertest

The CI pipeline runs:

```text
Unit Tests
     │
     ▼
Integration Tests
     │
     ▼
Docker Build
```

A Docker image is only published after the test stage succeeds.

---

# 📊 Logging

Application logging is handled with **Winston**.

The backend provides structured logging for:

* Database connections
* Authentication events
* CORS requests
* Validation errors
* Application errors
* Deployment/runtime debugging

---

# 🐳 Running Locally with Docker

Build and start the application:

```bash
docker compose up --build
```

This starts the required local services.

Stop containers:

```bash
docker compose down
```

View running containers:

```bash
docker ps
```

View backend logs:

```bash
docker logs savorly-api
```

---

# 💻 Local Development

Clone the repository:

```bash
git clone https://github.com/Elizbeh/savorly-backend.git
cd savorly-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

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

Run migrations:

```bash
npm run migrate
```

Seed the database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

---

# 📦 Docker Image

Production images are published to GitHub Container Registry:

```text
ghcr.io/elizbeh/savorly-backend
```

Example:

```bash
docker pull ghcr.io/elizbeh/savorly-backend:latest
```

Production deployments use immutable commit SHA tags:

```text
ghcr.io/elizbeh/savorly-backend:<commit-sha>
```

---

# 📚 API Overview

| Endpoint                 | Method             | Description          |
| ------------------------ | ------------------ | -------------------- |
| `/api/auth/register`     | POST               | Register a user      |
| `/api/auth/login`        | POST               | Login                |
| `/api/auth/verify-email` | GET                | Verify email         |
| `/api/recipes`           | GET                | Retrieve recipes     |
| `/api/recipes/create`    | POST               | Create a recipe      |
| `/api/profile`           | GET / PUT          | Manage user profile  |
| `/api/categories`        | GET / POST         | Manage categories    |
| `/api/saved-recipes`     | GET / POST         | Manage saved recipes |
| `/api/admin/users`       | GET / PUT / DELETE | User administration  |
| `/health`                | GET                | API health check     |

---

# 🛠️ Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MySQL
* TiDB Cloud

### Authentication

* JWT
* HTTP Cookies
* bcrypt

### Storage

* Cloudinary

### Email

* Nodemailer

### Testing

* Jest
* Supertest

### DevOps & Cloud

* Docker
* Docker Compose
* GitHub Actions
* GitHub Container Registry
* AWS EC2
* SSH-based automated deployment
* Health-check-based rollback

### Security

* Helmet
* XSS protection
* Express Rate Limit
* Joi validation
* CORS

### Logging

* Winston

---

# 🔗 Related Repositories

### Frontend

https://github.com/Elizbeh/savorly-frontend

### Original Full Project

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

# 🚧 Future Improvements

Planned DevOps improvements include:

* Infrastructure as Code with Terraform
* Kubernetes deployment
* Prometheus and Grafana monitoring
* Docker image vulnerability scanning
* Centralized log management
* Blue/Green deployments
* Improved observability and alerting

---

> Savorly demonstrates modern backend engineering and DevOps practices through containerization, automated testing, CI/CD, GitHub Container Registry, AWS deployment, health checks, and automatic rollback.
>
> **Frontend:** https://elizbeh.github.io/savorly-frontend/
>
> **Production API:** https://savorly.duckdns.org
