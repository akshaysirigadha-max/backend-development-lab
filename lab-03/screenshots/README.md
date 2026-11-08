# Screenshots Directory – Lab 3

This folder contains the verification screenshots for **Backend Development Fundamentals Lab 3**.

## Student Details
- **Student Name:** Akshay Sirigadha
- **Registration Number:** 252U1R9148
- **Course:** Backend Development Fundamentals (Year II – Term II)
- **University:** Aurora Deemed University
- **Faculty:** Joel Prashanth D

---

## Screenshot File Mapping

Capture each Postman / terminal response and save it under the exact filename listed below:

| # | Filename | Description | Method & URL / Command | Expected Status |
|---|---|---|---|---|
| 01 | `01-get-all-books.png` | Get all books (default query) | `GET http://localhost:3000/books` | 200 OK |
| 02 | `02-search-books.png` | Search books by title | `GET http://localhost:3000/books?search_q=JavaScript` | 200 OK |
| 03 | `03-sort-ascending.png` | Sort books by price ascending | `GET http://localhost:3000/books?order_by=price&order=ASC` | 200 OK |
| 04 | `04-sort-descending.png` | Sort books by price descending | `GET http://localhost:3000/books?order_by=price&order=DESC` | 200 OK |
| 05 | `05-pagination.png` | Pagination – First Page | `GET http://localhost:3000/books?limit=3&offset=0` | 200 OK |
| 06 | `06-pagination-next-page.png` | Pagination – Second Page | `GET http://localhost:3000/books?limit=3&offset=3` | 200 OK |
| 07 | `07-min-price-filter.png` | Minimum price filter | `GET http://localhost:3000/books?min_price=40` | 200 OK |
| 08 | `08-max-price-filter.png` | Maximum price filter | `GET http://localhost:3000/books?max_price=50` | 200 OK |
| 09 | `09-price-range.png` | Price range filter | `GET http://localhost:3000/books?min_price=40&max_price=50` | 200 OK |
| 10 | `10-combined-query.png` | Combined query parameters | `GET http://localhost:3000/books?search_q=JavaScript&order_by=price&order=ASC&limit=5&offset=0&min_price=25&max_price=50` | 200 OK |
| 11 | `11-get-book-by-id.png` | Get single book by ID | `GET http://localhost:3000/books/1` | 200 OK |
| 12 | `12-book-not-found.png` | Book not found | `GET http://localhost:3000/books/999` | 404 Not Found |
| 13 | `13-add-book.png` | Add a new book | `POST http://localhost:3000/books` | 201 Created |
| 14 | `14-missing-title.png` | Validation: missing title | `POST http://localhost:3000/books` (empty title) | 400 Bad Request |
| 15 | `15-missing-author.png` | Validation: missing author | `POST http://localhost:3000/books` (missing author) | 400 Bad Request |
| 16 | `16-invalid-price.png` | Validation: non-numeric price | `POST http://localhost:3000/books` (`price: "abc"`) | 400 Bad Request |
| 17 | `17-update-book.png` | Update book by ID | `PUT http://localhost:3000/books/1` | 200 OK |
| 18 | `18-update-invalid-id.png` | Update non-existent ID | `PUT http://localhost:3000/books/999` | 404 Not Found |
| 19 | `19-delete-book.png` | Delete book by ID | `DELETE http://localhost:3000/books/11` | 200 OK |
| 20 | `20-delete-invalid-id.png` | Delete non-existent ID | `DELETE http://localhost:3000/books/999` | 404 Not Found |
| 21 | `21-sqlite-database.png` | SQLite CLI or database inspection | Query showing 10 seeded records in `book` table | Terminal / GUI |
| 22 | `22-port-conflict.png` | Port conflict error (`EADDRINUSE`) | Running two server instances on port 3000 | Terminal output |
| 23 | `23-import-error.png` | Module not found error | `require('database')` without `./` | Terminal output |
| 24 | `24-table-error.png` | SQLite table typo error | `SELECT * FROM books` (plural typo) | 500 Error |
| 25 | `25-missing-await.png` | Missing await debugging demonstration | Calling `db.get()` without `await` | Output / Response |

