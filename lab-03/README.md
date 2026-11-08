# Lab 3: REST API, Query Parameters, Validation and Debugging

## Student Details

- **Student Name:** Akshay Sirigadha
- **Registration Number:** 252U1R9148
- **Course:** Backend Development Fundamentals
- **Academic Term:** Year II – Term II
- **University:** Aurora Deemed University
- **Faculty:** Joel Prashanth D

---

## Live Link

- **Deployment URL:** `[Deployment Pending - Will be updated upon cloud release]`
- **Deployment Platform:** Render (Web Service) / Localhost:3000
- **Status:** Verified locally & ready for cloud deployment

---

## Objective

The objective of Lab 3 is to advance the backend concepts learned in Lab 2 by building an extensible, production-ready RESTful API using Node.js, Express.js, and SQLite. This project demonstrates:
1. Developing structured REST API endpoints conforming to industry conventions.
2. Query parameter handling for partial search with SQL `LIKE`.
3. Safe dynamic sorting using SQL `ORDER BY` with column allowlisting.
4. Pagination using SQL `LIMIT` and `OFFSET`.
5. Price-range filtering using SQL comparison operators.
6. Robust input validation for request parameters, query strings, and JSON request bodies.
7. Consistent HTTP status codes (200, 201, 400, 404, 500).
8. Diagnosing and resolving common backend errors (Port conflict `EADDRINUSE`, import errors, SQLite table typos, and missing `await`).

---

## Technologies and Packages Used

- **Node.js** – Asynchronous JavaScript runtime environment.
- **Express.js (`express`)** – Minimal web application framework for routing and middleware.
- **SQLite3 (`sqlite3`)** – Embedded, file-based SQL database engine.
- **SQLite Wrapper (`sqlite`)** – Promise-based wrapper enabling `async/await` syntax for SQLite.
- **Nodemon (`nodemon`)** – Developer utility to automatically restart the server upon source modifications.
- **Postman** – API development and testing tool for verifying HTTP requests and responses.
- **VS Code** – Integrated development environment.

---

## Project Structure

```text
lab-03/
├── server.js                      # Express server, route definitions, and validation logic
├── database.js                    # SQLite connection, table schema creation, and seeding
├── database.db                    # SQLite database containing the 'book' table
├── package.json                   # Project metadata, dependencies, and start scripts
├── .gitignore                     # Git ignore rules (node_modules, logs, .env)
├── verify-endpoints.js            # Automated verification test suite for all endpoints
├── README.md                      # Comprehensive lab report and Postman documentation
├── screenshots/                   # Verification screenshots
│   ├── README.md                  # Screenshot index and capture instructions
│   ├── 01-get-all-books.png
│   ├── 02-search-books.png
│   ├── 03-sort-ascending.png
│   ├── 04-sort-descending.png
│   ├── 05-pagination.png
│   ├── 06-pagination-next-page.png
│   ├── 07-min-price-filter.png
│   ├── 08-max-price-filter.png
│   ├── 09-price-range.png
│   ├── 10-combined-query.png
│   ├── 11-get-book-by-id.png
│   ├── 12-book-not-found.png
│   ├── 13-add-book.png
│   ├── 14-missing-title.png
│   ├── 15-missing-author.png
│   ├── 16-invalid-price.png
│   ├── 17-update-book.png
│   ├── 18-update-invalid-id.png
│   ├── 19-delete-book.png
│   ├── 20-delete-invalid-id.png
│   ├── 21-sqlite-database.png
│   ├── 22-port-conflict.png
│   ├── 23-import-error.png
│   ├── 24-table-error.png
│   └── 25-missing-await.png
└── debugging/
    └── debugging-exercises.md     # Detailed writeup of the 4 debugging exercises
```

---

## Database Schema and Initial Seed Data

### Table: `book`
```sql
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);
```

### Initial 10 Records:
| ID | Title | Author | Price ($) | Pages |
|:--:|---|---|:--:|:--:|
| 1 | The Pragmatic Programmer | Andrew Hunt & David Thomas | 45 | 352 |
| 2 | Clean Code | Robert C. Martin | 40 | 464 |
| 3 | JavaScript: The Good Parts | Douglas Crockford | 30 | 176 |
| 4 | Design Patterns | Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides | 55 | 395 |
| 5 | Introduction to Algorithms | Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein | 85 | 1312 |
| 6 | You Don't Know JS Yet | Kyle Simpson | 25 | 142 |
| 7 | Designing Data-Intensive Applications | Martin Kleppmann | 50 | 616 |
| 8 | Refactoring: Improving the Design of Existing Code | Martin Fowler | 48 | 448 |
| 9 | Node.js Design Patterns | Mario Casciaro & Luciano Mammino | 42 | 520 |
| 10 | Eloquent JavaScript | Marijn Haverbeke | 35 | 472 |

---

## Installation & Running the Server

### 1. Install Dependencies
Navigate into the `lab-03` directory and install the required npm packages:
```bash
cd lab-03
npm install
```

### 2. Start the Server
Run the application using standard Node.js:
```bash
npm start
```
Or start in development mode with automatic reload on changes:
```bash
npm run dev
```

The terminal will log:
```text
Server Running at http://localhost:3000/
```

### 3. Run Automated Endpoint Verification
To verify all routes, filtering, sorting, pagination, and error scenarios automatically:
```bash
node verify-endpoints.js
```

---

## REST API Endpoints Overview

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/books` | Retrieve books with search, sort, filter, and pagination | `200 OK`, `400 Bad Request` |
| `GET` | `/books/:bookId` | Retrieve a single book by ID | `200 OK`, `404 Not Found` |
| `POST` | `/books` | Insert a new book record with validation | `201 Created`, `400 Bad Request` |
| `PUT` | `/books/:bookId` | Update an existing book record with validation | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/books/:bookId` | Delete a book record by ID | `200 OK`, `404 Not Found` |

---

## Query Parameters Explanation (`GET /books`)

| Parameter | Type | Default | Description | Example |
|---|---|---|---|---|
| `search_q` | String | `""` | Filters books whose title contains the substring using SQL `LIKE %search_q%`. | `?search_q=JavaScript` |
| `order_by` | String | `"id"` | Column used for sorting. Must be one of: `['id', 'title', 'author', 'price', 'pages']`. | `?order_by=price` |
| `order` | String | `"ASC"` | Sort direction: `"ASC"` (ascending) or `"DESC"` (descending). | `?order=DESC` |
| `limit` | Number | `10` | Maximum number of records to return. Must be a non-negative integer. | `?limit=5` |
| `offset` | Number | `0` | Number of records to skip for pagination. Must be non-negative. | `?offset=5` |
| `min_price` | Number | `0` | Minimum book price filter (`price >= min_price`). | `?min_price=30` |
| `max_price` | Number | `1000000` | Maximum book price filter (`price <= max_price`). | `?max_price=50` |

### Security Note: SQL Injection Protection
- **Value Placeholders (`?`)**: Used for `title LIKE ?`, `price >= ?`, `price <= ?`, `LIMIT ?`, and `OFFSET ?`. User input is escaped automatically by the SQLite engine.
- **Identifier Allowlist**: Dynamic column sorting (`ORDER BY`) cannot accept parameterized placeholders. To prevent SQL injection, the server validates `order_by` against an allowlist array:
```javascript
const allowedColumns = ['id', 'title', 'author', 'price', 'pages']
const safeOrderBy = allowedColumns.includes(order_by) ? order_by : 'id'
const safeOrder = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
```

---

## Comprehensive Postman Testing Guide

**Base URL:** `http://localhost:3000`

### 1. GET Requests (Search, Filter, Sort, Pagination)

#### Test Case 1: Get All Books
- **Method:** `GET`
- **URL:** `http://localhost:3000/books`
- **Status:** `200 OK`
- **Expected Response:** JSON array containing all 10 books in default order (by `id ASC`).

#### Test Case 2: Search Books by Title
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?search_q=JavaScript`
- **Status:** `200 OK`
- **Expected Response:** 2 books matching the keyword:
  1. `JavaScript: The Good Parts` (ID: 3, Price: 30)
  2. `Eloquent JavaScript` (ID: 10, Price: 35)

#### Test Case 3: Sort by Price Ascending
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?order_by=price&order=ASC`
- **Status:** `200 OK`
- **Expected Response:** 10 books sorted by price from cheapest ($25) to most expensive ($85).
  - First record: `You Don't Know JS Yet` ($25)
  - Last record: `Introduction to Algorithms` ($85)

#### Test Case 4: Sort by Price Descending
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?order_by=price&order=DESC`
- **Status:** `200 OK`
- **Expected Response:** 10 books sorted in reverse price order ($85 down to $25).
  - First record: `Introduction to Algorithms` ($85)
  - Last record: `You Don't Know JS Yet` ($25)

#### Test Case 5: Pagination – First Page
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?limit=3&offset=0`
- **Status:** `200 OK`
- **Expected Response:** First 3 books (IDs: 1, 2, 3).

#### Test Case 6: Pagination – Second Page
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?limit=3&offset=3`
- **Status:** `200 OK`
- **Expected Response:** Next 3 books (IDs: 4, 5, 6).

#### Test Case 7: Minimum Price Filter
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?min_price=50`
- **Status:** `200 OK`
- **Expected Response:** Books with price >= $50:
  - `Design Patterns` ($55)
  - `Introduction to Algorithms` ($85)
  - `Designing Data-Intensive Applications` ($50)

#### Test Case 8: Maximum Price Filter
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?max_price=35`
- **Status:** `200 OK`
- **Expected Response:** Books with price <= $35:
  - `JavaScript: The Good Parts` ($30)
  - `You Don't Know JS Yet` ($25)
  - `Eloquent JavaScript` ($35)

#### Test Case 9: Price Range Filter
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?min_price=40&max_price=50`
- **Status:** `200 OK`
- **Expected Response:** 5 books with prices between $40 and $50:
  - `The Pragmatic Programmer` ($45)
  - `Clean Code` ($40)
  - `Designing Data-Intensive Applications` ($50)
  - `Refactoring: Improving the Design of Existing Code` ($48)
  - `Node.js Design Patterns` ($42)

#### Test Case 10: Combined Query Parameters
- **Method:** `GET`
- **URL:** `http://localhost:3000/books?search_q=JavaScript&order_by=price&order=ASC&limit=5&offset=0&min_price=25&max_price=50`
- **Status:** `200 OK`
- **Expected Response:** 2 books matching keyword "JavaScript", price between $25 and $50, sorted by price ASC:
```json
[
  {
    "id": 3,
    "title": "JavaScript: The Good Parts",
    "author": "Douglas Crockford",
    "price": 30,
    "pages": 176
  },
  {
    "id": 10,
    "title": "Eloquent JavaScript",
    "author": "Marijn Haverbeke",
    "price": 35,
    "pages": 472
  }
]
```

#### Test Case 11: Get Individual Book
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1`
- **Status:** `200 OK`
- **Expected Response:**
```json
{
  "id": 1,
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt & David Thomas",
  "price": 45,
  "pages": 352
}
```

#### Test Case 12: Book Not Found
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/999`
- **Status:** `404 Not Found`
- **Expected Response:**
```json
{
  "error": "Book Not Found"
}
```

---

### 2. POST Requests (Add Book & Input Validation)

#### Test Case 13: Add a Valid Book
- **Method:** `POST`
- **URL:** `http://localhost:3000/books`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Python Programming",
  "author": "John",
  "price": 60,
  "pages": 350
}
```
- **Status:** `201 Created`
- **Expected Response:**
```json
{
  "message": "Book Added Successfully",
  "bookId": 11
}
```

#### Test Case 14: Validation – Missing Title
- **Method:** `POST`
- **URL:** `http://localhost:3000/books`
- **Request Body:**
```json
{
  "title": "",
  "author": "John",
  "price": 60,
  "pages": 350
}
```
- **Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "Invalid or missing title"
}
```

#### Test Case 15: Validation – Missing Author
- **Method:** `POST`
- **URL:** `http://localhost:3000/books`
- **Request Body:**
```json
{
  "title": "Python Programming",
  "author": "   ",
  "price": 60,
  "pages": 350
}
```
- **Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "Invalid or missing author"
}
```

#### Test Case 16: Validation – Non-numeric Price
- **Method:** `POST`
- **URL:** `http://localhost:3000/books`
- **Request Body:**
```json
{
  "title": "Python Programming",
  "author": "John",
  "price": "sixty",
  "pages": 350
}
```
- **Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "error": "Price must be a valid number"
}
```

---

### 3. PUT Requests (Update Book & Validation)

#### Test Case 17: Update Book
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/1`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "The Pragmatic Programmer (20th Anniversary Edition)",
  "author": "Andrew Hunt & David Thomas",
  "price": 50,
  "pages": 360
}
```
- **Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Book Details Updated"
}
```

#### Test Case 18: Update Nonexistent ID
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/999`
- **Request Body:**
```json
{
  "title": "Unknown Book",
  "author": "Ghost Writer",
  "price": 40,
  "pages": 200
}
```
- **Status:** `404 Not Found`
- **Expected Response:**
```json
{
  "error": "Book Not Found"
}
```

---

### 4. DELETE Requests (Delete Book)

#### Test Case 19: Delete Book
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/11`
- **Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Book Removed"
}
```

#### Test Case 20: Delete Nonexistent ID
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/999`
- **Status:** `404 Not Found`
- **Expected Response:**
```json
{
  "error": "Book Not Found"
}
```

---

## HTTP Status Codes Used

| Code | Label | Usage in Lab 3 |
|---|---|---|
| **200** | **OK** | Returned for successful `GET` queries, successful `PUT` updates, and successful `DELETE` requests. |
| **201** | **Created** | Returned when a new book record is successfully created via `POST /books`. |
| **400** | **Bad Request** | Returned when validation fails (missing title, blank author, non-numeric price/pages, negative limits, or `min_price > max_price`). |
| **404** | **Not Found** | Returned when querying, updating, or deleting a book with an ID that does not exist in the database. |
| **500** | **Internal Server Error** | Returned if an unhandled runtime or database driver error occurs inside `try/catch`. |

---

## Screenshots and Visual Verification

All execution screenshots are cataloged below. Capture images during testing and store them in the `screenshots/` directory matching the designated filenames:

### 1. Query Parameters, Search & Sorting
| Screenshot Reference | Description |
|---|---|
| ![01 Get All Books](screenshots/01-get-all-books.png) | `GET /books` returning all 10 books |
| ![02 Search Books](screenshots/02-search-books.png) | `GET /books?search_q=JavaScript` |
| ![03 Sort Ascending](screenshots/03-sort-ascending.png) | `GET /books?order_by=price&order=ASC` |
| ![04 Sort Descending](screenshots/04-sort-descending.png) | `GET /books?order_by=price&order=DESC` |

### 2. Pagination & Filtering
| Screenshot Reference | Description |
|---|---|
| ![05 Pagination First Page](screenshots/05-pagination.png) | `GET /books?limit=3&offset=0` |
| ![06 Pagination Next Page](screenshots/06-pagination-next-page.png) | `GET /books?limit=3&offset=3` |
| ![07 Min Price Filter](screenshots/07-min-price-filter.png) | `GET /books?min_price=40` |
| ![08 Max Price Filter](screenshots/08-max-price-filter.png) | `GET /books?max_price=50` |
| ![09 Price Range](screenshots/09-price-range.png) | `GET /books?min_price=40&max_price=50` |
| ![10 Combined Query](screenshots/10-combined-query.png) | Search, sort, filter, and pagination combined |

### 3. CRUD Operations & Validation
| Screenshot Reference | Description |
|---|---|
| ![11 Get Book by ID](screenshots/11-get-book-by-id.png) | `GET /books/1` returning single book |
| ![12 Book Not Found](screenshots/12-book-not-found.png) | `GET /books/999` returning 404 |
| ![13 Add Book](screenshots/13-add-book.png) | `POST /books` returning 201 Created |
| ![14 Missing Title](screenshots/14-missing-title.png) | `POST /books` with missing title returning 400 |
| ![15 Missing Author](screenshots/15-missing-author.png) | `POST /books` with missing author returning 400 |
| ![16 Invalid Price](screenshots/16-invalid-price.png) | `POST /books` with invalid price returning 400 |
| ![17 Update Book](screenshots/17-update-book.png) | `PUT /books/1` returning 200 |
| ![18 Update Invalid ID](screenshots/18-update-invalid-id.png) | `PUT /books/999` returning 404 |
| ![19 Delete Book](screenshots/19-delete-book.png) | `DELETE /books/11` returning 200 |
| ![20 Delete Invalid ID](screenshots/20-delete-invalid-id.png) | `DELETE /books/999` returning 404 |

### 4. Database & Debugging Demonstrations
| Screenshot Reference | Description |
|---|---|
| ![21 SQLite Database](screenshots/21-sqlite-database.png) | Database inspection showing 10 records |
| ![22 Port Conflict](screenshots/22-port-conflict.png) | `EADDRINUSE` port collision terminal log |
| ![23 Import Error](screenshots/23-import-error.png) | `MODULE_NOT_FOUND` import path error log |
| ![24 Table Typo Error](screenshots/24-table-error.png) | `SQLITE_ERROR: no such table: books` 500 log |
| ![25 Missing Await](screenshots/25-missing-await.png) | `db.get()` without `await` returning `{}` log |

---

## Debugging Exercises Summary

Detailed writeups, root cause analyses, incorrect code samples, error outputs, and fixes are provided in [`debugging/debugging-exercises.md`](./debugging/debugging-exercises.md):

1. **Port Conflict (`EADDRINUSE`)**:
   - *Problem:* Launching server on an occupied port (3000).
   - *Fix:* Configure dynamic fallback `process.env.PORT || 3001` or terminate the blocking process using `Stop-Process -Id <PID> -Force`.
2. **Wrong Import Path (`MODULE_NOT_FOUND`)**:
   - *Problem:* Using `require('database')` instead of relative path `./database`.
   - *Fix:* Use explicit relative path `require('./database')`.
3. **SQLite Table-Name Typo (`no such table`)**:
   - *Problem:* Querying plural `FROM books` when schema table is `book`.
   - *Fix:* Correct query to `FROM book` matching SQLite schema.
4. **Missing `await` in Async Database Calls**:
   - *Problem:* Omitting `await` returns an unresolved `Promise<Pending>`, causing Express to serialize an empty object `{}` and bypass 404 checks.
   - *Fix:* Add `await` keyword before `db.get()`, `db.all()`, and `db.run()`.

---

## Problems Faced and Solutions

1. **SQL Injection Vulnerability in `ORDER BY` Clause**:
   - *Problem:* SQLite parameter placeholders (`?`) cannot be used for SQL identifiers like column names or sort directions (`ASC`/`DESC`).
   - *Solution:* Implemented an allowlist array `['id', 'title', 'author', 'price', 'pages']`. Only allowlisted column names are injected into the template string; any unsupported input safely falls back to `'id'`.
2. **Preventing Duplicate Seed Data on Server Restart**:
   - *Problem:* Running `INSERT INTO book` upon each server restart duplicated the 10 initial records repeatedly.
   - *Solution:* Added a pre-seed count query `SELECT COUNT(*) AS count FROM book;`. Seed insertion only triggers if `count === 0`.
3. **Query Parameter Type Coercion**:
   - *Problem:* All values in `request.query` arrive as strings (e.g. `'40'`). Direct comparison in JavaScript or passing string limits can cause unexpected behavior.
   - *Solution:* Parsed numeric query parameters using `Number()` and validated with `isNaN()` before querying SQLite.

---

## Conclusion

Lab 3 successfully expands upon foundational backend development by incorporating comprehensive RESTful API capabilities:
- Dynamic search with SQL `LIKE`
- Secure sorting with allowlisting
- Pagination with `LIMIT` and `OFFSET`
- Price filtering
- Strict payload validation
- Standardized HTTP status codes (200, 201, 400, 404, 500)
- Thorough debugging strategies

The architecture maintains a clear separation of concerns between database initialization (`database.js`) and route handling (`server.js`), ensuring beginner-friendly maintainability for university practical examinations and production deployment.

