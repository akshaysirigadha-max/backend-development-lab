# Backend Development Lab

## Student Details
- **Student Name:** Akshay Sirigadha
- **Registration Number:** 252U1R9148
- **Section:** CSE GEN AI (2C)
- **Course:** Backend Development Fundamentals

---

## Repository Structure

This repository contains the backend development laboratory assignments and projects:

- [`lab-01/`](./lab-01): **Node.js and Express Server**
  - Basic HTTP server using Node.js built-in `http` module.
  - Express.js server with routes (`/`, `/about`, `/time`, 404 handler).
- [`lab-02/`](./lab-02): **SQLite Database & RESTful CRUD Routes**
  - Express.js application connected to SQLite database (`database.db`).
  - 5 standard CRUD endpoints (`GET /books`, `POST /books`, `GET /books/:bookId`, `PUT /books/:bookId`, `DELETE /books/:bookId`).
  - Parameterized SQL queries and schema seeding (`seed.sql`).
- [`lab-03/`](./lab-03): **REST API, Query Parameters, Validation and Debugging**
  - Search via `LIKE` (`search_q`), sorting (`order_by`, `order`), pagination (`limit`, `offset`), and price filtering (`min_price`, `max_price`).
  - Request body & query parameter validation with accurate HTTP status codes (200, 201, 400, 404, 500).
  - 4 comprehensive debugging exercises (`EADDRINUSE`, wrong import path, table name typos, and missing `await`).

