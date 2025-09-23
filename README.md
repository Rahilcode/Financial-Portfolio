# Portfolio Management Full-Stack Application

## Table of Contents

- [Architecture](#architecture)
- [Core Features](#core-features)
- [Backend](#backend)
- [Frontend](#frontend)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend-setup)
  - [Frontend](#frontend-setup)
  - [Docker](#docker-setup)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Architecture

This project is a full-stack application consisting of:

- **Backend**: Java Spring Boot application providing RESTful APIs for portfolio and asset management, fetching historical stock data, and generating AI-driven portfolio insights.
- **Frontend**: React/Next.js single-page application that consumes backend APIs, providing user authentication, portfolio management, and data visualization (charts for historical prices and asset allocation).
- **Database**: PostgreSQL stores user data, portfolios, and assets.
- **Security**: Spring Security with JWT for authentication and secure API endpoints.
- **Data Visualization**: Chart.js is used for line and pie charts for historical prices and portfolio allocations.
- **AI/ML Simulation**: A mock API simulates portfolio insights, including diversification score and hypothetical asset recommendations.
- **External API**: Alpha Vantage API for current asset price (real time data) and Yahoo Financial api for fetching history data of the asset.

---

## Core Features

### Backend

- **Portfolio Management**

  - Create new portfolios
  - Add/remove assets by ticker symbol
  - Retrieve portfolio details, including assets and market values

- **Data Integration**

  - Fetch real-time and historical stock data using [Alpha Vantage]() or Yahoo Finance

- **Database**

  - PostgreSQL schema for users, portfolios, and assets
  - Relationships: Users → Portfolios → Assets

- **Security**

  - JWT-based authentication
  - Secured endpoints for portfolio operations

- **AI/ML Simulation**
  - Mock endpoint providing:
    - Diversification Score
    - Asset recommendations

### Frontend

- **User Interface**

  - Login/registration page with JWT authentication
  - Dashboard showing portfolios and assets
  - Add stocks by ticker symbol
  - List assets with ticker, price, quantity, and total value

- **Data Visualization**

  - Line chart: Historical stock prices (30 days, 1 year, 3 years)
  - Pie chart: Portfolio allocation by asset weight

- **UX**

  - Responsive design with TailwindCSS
  - Loading spinners and error handling
  - Empty portfolio messages

- **API Communication**
  - Fetches data from Spring Boot backend via RESTful endpoints

---

## Technology Stack

- **Backend**: Java, Spring Boot, Spring Security, JWT, RestTemplate/WebClient, PostgreSQL
- **Frontend**: React.js, Next.js, TailwindCSS, Chart.js, Framer Motion
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend), Heroku/AWS (backend)
- **Containerization**: Docker, docker-compose

---

## Setup & Installation

### Backend Setup

Clone repository
git clone [<repository-url>](https://github.com/Rahilcode/Financial-Portfolio/edit/main)

cd backend

# Configure PostgreSQL in application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio
spring.datasource.username=postgres
spring.datasource.password=yourpassword

Build and run backend

Option 1:
./mvnw clean install
./mvnw spring-boot:run

Option 2:
docker compose up --build

### Frontend Setup

Navigate to frontend folder
cd frontend

Install dependencies
npm install

Run development server
npm run dev

Frontend will be available at http://localhost:3000

### Docker Setup

Start backend and PostgreSQL with Docker
docker-compose up --build

This will spin up:

- PostgreSQL database
- Backend Spring Boot server

---

## Deployment

- **Frontend**: Deploy to [Vercel]() or [Netlify]()
- **Backend**: Deploy to [Heroku]() or AWS Elastic Beanstalk
- Update the frontend `.env` to point to your deployed backend API URL

---

## API Endpoints

### Auth

- `POST /auth/register` → Register user
- `POST /auth/login` → Login user, returns JWT

### Portfolio

- `GET /portfolios` → List all portfolios for user
- `POST /portfolios` → Create a new portfolio
- `POST /portfolios/{id}/assets` → Add asset to portfolio
- `DELETE /portfolios/{id}/assets/{assetId}` → Remove asset
- `GET /portfolios/{id}/insights` → Fetch AI/ML simulated insights

### Market Data

- `GET /market-data/{portfolioId}/assets/{ticker}/history?days=X` → Fetch historical stock prices

---
