# Campaign Manager Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

Developed by **Miguel Rodríguez** as a technical take-home challenge for **PUSE Agencia**.

## Badges
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/mrodriguezul/campaign-manager-app/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/mrodriguezul/campaign-manager-app/tree/main)

## Project Objective

Build a scalable, enterprise-ready REST API for managing call center campaigns, agents, leads, and immutable call logs, with a clean architecture and strict separation of concerns.

## Features

- Complete CRUD operations for agents, campaigns, and leads
- JWT-based authentication and authorization
- Immutable call logs for reliable auditability
- AI-generated call summaries using the Google Gemini API
- ESM (ECMAScript Modules) support
- Fully containerized development and testing environments
- Interactive API documentation with Swagger

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| NestJS | Backend application framework |
| TypeScript | Strongly typed application development |
| PostgreSQL | Relational database |
| TypeORM | Object-relational mapping |
| Jest | Unit and integration testing |
| Supertest | HTTP endpoint testing |
| Docker | Application containerization |
| pnpm | Package management |

## Prerequisites

Install the following tools before running the project:

- [Docker](https://www.docker.com/)
- Docker Compose
- [Git](https://git-scm.com/)

## Environment Variables

Create a `.env` file at the project root using the provided `.env.example` template.

| Variable | Description |
|---|---|
| `POSTGRES_USER` | PostgreSQL database username |
| `POSTGRES_PASSWORD` | PostgreSQL database password |
| `POSTGRES_DB` | PostgreSQL database name |
| `JWT_SECRET` | Secret key used to sign and validate JWT tokens |
| `GEMINI_API_KEY` | Valid Google Gemini API key used to generate call summaries |

## Pre-run Warnings (Errors to fix before running)

Before executing any script, ensure that ports `3000` and `5433` are available on the host machine.

You must also configure a valid `GEMINI_API_KEY` in the `.env` file. An invalid or missing key may cause build or runtime crashes.

## How to Run the App

The project includes a one-click deployment script that handles the complete local setup.

Run:

```bash
chmod 711 ./run-run_dev.sh
./run_dev.sh
```

The script uses `docker-compose.yml` and automatically manages:

- Database startup and initialization
- Backend container startup
- Application initialization
- Graceful infrastructure teardown when the script exits

## API Documentation

Once the application is running, access the interactive Swagger documentation at:

[http://localhost:3000/docs](http://localhost:3000/docs)

## How to Run the Tests

The project provides two testing layers.

Run the unit tests natively with:

```bash
pnpm test
```

For the recommended end-to-end test suite, run:

```bash
chmod 711 ./run-tests.sh
./run-tests.sh
```

The automated End-to-End tests use a dedicated `docker-compose.test.yml` environment. The script:

- Spins up isolated testing infrastructure
- Runs the tests against a pristine database
- Validates the API through real HTTP requests
- Tears down all test containers and resources automatically

## Areas for Improvement

Future enhancements could include:

- Adding Redis to cache frequent queries and improve response times
- Implementing a CI/CD pipeline for automated validation and deployment
- Adding monitoring and telemetry tools for metrics, tracing, and centralized logging
- Introducing rate limiting and additional API security controls
- Expanding observability and operational dashboards for production environments
