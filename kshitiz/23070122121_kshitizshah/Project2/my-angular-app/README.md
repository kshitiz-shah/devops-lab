# Project 2 - Angular App with Docker

**Name:** Kshitij shah  
**PRN:** 23070122121  

---

## Objective
Containerize an Angular application using multi-stage Docker builds with separate development and production environments, served via Nginx.

## Prerequisites
- Node.js & npm
- Docker
- Angular CLI

## Software Used
- Angular 21
- Docker
- Nginx
- Docker Compose

## Project Structure
```
my-angular-app/
├── src/                        # Angular source code
├── Dockerfile                  # Production multi-stage build
├── Dockerfile.dev              # Development build
├── docker-compose.yml          # Dev environment
├── docker-compose.prod.yml     # Production environment
└── .dockerignore
```

## Procedure

### Development
```bash
docker-compose up --build
```
Visit `http://localhost:4200`

### Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```
Visit `http://localhost:80`

## Screenshots
See the `screenshots/` folder for step-by-step visual documentation.
