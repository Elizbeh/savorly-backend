# 🍳 Savorly Backend

A production-ready REST API powering **Savorly**, a full-stack recipe-sharing application.

The backend is built with **Node.js**, **Express.js**, and **MySQL**, with a DevOps-focused deployment architecture using Docker, GitHub Actions, GitHub Container Registry, AWS EC2, Terraform, automated health checks, and rollback.

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
         Test & Validate              Build Docker Image
                │                             │
                │                             ▼
                │                    GitHub Container
                │                       Registry
                │                             │
                └──────────────┬──────────────┘
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
                         /          \
                        /            \
                       ▼              ▼
                    MySQL        Cloudinary
                   Database      Image Storage


                 Terraform
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       AWS EC2             Security Group
          │
          └──────────┬──────────┘
                     │
                 Remote State
                     ▼
                Amazon S3
```

---

# 🔄 CI/CD Pipeline

Every push to `master` or `dev`, as well as pull requests targeting those branches, triggers the backend CI/CD workflow.

```text
Push / Pull Request
        │
        ▼
Checkout Repository
        │
        ▼
Setup Node.js 20
        │
        ▼
Install Dependencies
        │
        ▼
Start MySQL Test Service
        │
        ▼
Run Database Migrations
        │
        ▼
Seed Test Database
        │
        ▼
Unit Tests
        │
        ▼
Integration Tests
        │
        ▼
Build Docker Image
        │
        ▼
Publish to GHCR
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
   ┌────┴────┐
   │         │
 PASS       FAIL
   │         │
   ▼         ▼
Keep      Roll Back
version   previous image
```

### Pipeline stages

The pipeline is divided into three jobs:

#### 1. Test

The test job:

* Creates a temporary MySQL 8 service
* Installs dependencies with `npm ci`
* Waits for MySQL to become healthy
* Mocks the email service
* Runs database migrations
* Seeds the test database
* Runs unit tests
* Runs integration tests

The Docker build cannot start unless the tests pass.

#### 2. Docker Build

After successful testing, the application is:

* Built from the `Dockerfile`
* Tagged with the Git commit SHA
* Tagged as `latest`
* Published to GitHub Container Registry

Example:

```text
ghcr.io/elizbeh/savorly-backend:<commit-sha>
```

Using the commit SHA makes every production deployment traceable to an exact Git commit.

#### 3. AWS Deployment

GitHub Actions connects to the EC2 server using SSH and:

1. Logs into GHCR
2. Pulls the new Docker image
3. Saves the currently running image
4. Stops the existing container
5. Removes the old container
6. Starts the new container
7. Runs the `/health` endpoint
8. Keeps the new version if healthy
9. Automatically restores the previous image if the health check fails

---

# 🔄 Automatic Rollback

The deployment process includes a health-check-based rollback strategy.

```text
                New Docker Image
                       │
                       ▼
                Start container
                       │
                       ▼
                GET /health
                       │
              ┌────────┴────────┐
              │                 │
             PASS              FAIL
              │                 │
              ▼                 ▼
        Deployment OK       Stop container
                                  │
                                  ▼
                         Restore previous image
                                  │
                                  ▼
                            Health check
                                  │
                                  ▼
                         Rollback successful
```

Before replacing the running container, the currently deployed image is saved.

This provides a simple deployment safety mechanism without requiring manual intervention when a new version fails its health check.

---

# 🐳 Docker

The backend is containerized using Docker.

### Production container

```text
Docker Image
     │
     ▼
GitHub Container Registry
     │
     ▼
AWS EC2
     │
     ▼
savorly-api
     │
     └── Port 5000
```

### Local development

Docker Compose is used to run the backend and MySQL together:

```text
        Docker Compose
              │
       ┌──────┴──────┐
       ▼             ▼
    Backend         MySQL 8
    Node.js         Database
```

---

# ☁️ Infrastructure as Code

The AWS infrastructure is now managed with **Terraform**.

Terraform manages the existing Savorly infrastructure, including:

* AWS EC2 instance
* EC2 security group
* Infrastructure variables
* Terraform outputs
* Remote Terraform state

The existing AWS resources were imported into Terraform rather than recreated, allowing the production infrastructure to be brought under Infrastructure as Code safely.

### Terraform architecture

```text
                    Terraform
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
      AWS EC2                  Security Group
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
                  AWS Infrastructure
```

### Remote Terraform state

Terraform state is stored remotely in **Amazon S3** instead of being committed to Git.

```text
Terraform Code
     │
     ▼
GitHub Repository

Terraform State
     │
     ▼
Amazon S3
```

This separates infrastructure configuration from infrastructure state and prevents the state file from being stored in the repository.

### Terraform workflow

```bash
terraform init
terraform validate
terraform plan
terraform apply
```

The infrastructure is regularly verified with:

```bash
terraform plan
```

A clean infrastructure state produces:

```text
No changes. Your infrastructure matches the configuration.
```

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
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── .gitignore
│   └── .terraform.lock.hcl
│
├── Dockerfile
├── docker-compose.yml
├── server.js
└── package.json
```

Terraform state files and the `.terraform` working directory are intentionally excluded from Git.

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
* Secure HTTP cookies
* JWT authentication
* Parameterized SQL queries
* CORS configuration
* Environment-based secrets

Production secrets are kept outside the repository and injected into the Docker container through environment configuration.

Sensitive credentials are never stored in the Git repository.

---

# 🗄️ Database

The backend uses MySQL with:

* Connection pooling
* Automated migrations
* Database seeding
* Isolated test database
* Migration checks for existing columns

Run migrations:

```bash
npm run migrate
```

Seed the database:

```bash
npm run seed
```

---

# 🧪 Testing

Testing is automated with:

* Jest
* Supertest

The CI pipeline executes:

```text
Unit Tests
     │
     ▼
Integration Tests
     │
     ▼
Docker Build
```

The Docker image is only published after the test stage succeeds.

---

# 📊 Logging

Application logging is handled with **Winston**.

Structured logging is used for:

* Database connections
* Authentication events
* CORS requests
* Validation errors
* Application errors
* Runtime debugging

---

# 🐳 Running Locally with Docker

Build and start the application:

```bash
docker compose up --build
```

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

Pull the latest image:

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

### Containers

* Docker
* Docker Compose

### CI/CD

* GitHub Actions
* GitHub Container Registry
* SSH-based AWS deployment
* Automated health checks
* Automatic rollback
* Commit SHA image versioning

### Cloud & Infrastructure

* AWS EC2
* Amazon S3
* Terraform
* Infrastructure as Code
* Remote Terraform state

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

* Terraform management of additional AWS resources
* More restrictive SSH/network security
* Infrastructure provisioning automation
* Terraform CI/CD with automated `plan`
* Kubernetes deployment
* Prometheus and Grafana monitoring
* Docker image vulnerability scanning
* Centralized log management
* Blue/Green deployments
* Improved observability and alerting

---

> Savorly demonstrates modern backend engineering and DevOps practices through containerization, automated testing, CI/CD, GitHub Container Registry, Infrastructure as Code with Terraform, AWS deployment, remote Terraform state, health checks, and automatic rollback.
>
> **Frontend:** https://elizbeh.github.io/savorly-frontend/
>
> **Production API:** https://savorly.duckdns.org
>
> **API Health:** https://savorly.duckdns.org/health
