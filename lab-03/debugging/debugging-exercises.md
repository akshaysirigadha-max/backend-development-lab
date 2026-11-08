# Lab 3: Debugging Exercises in Backend Development

**Student Name:** Akshay Sirigadha  
**Registration Number:** 252U1R9148  
**Course:** Backend Development Fundamentals  
**Academic Term:** Year II – Term II  
**Faculty:** Joel Prashanth D  
**University:** Aurora Deemed University  

---

## Overview

When developing Node.js and Express applications with SQLite databases, developers frequently encounter runtime errors related to network ports, file paths, database tables, and asynchronous execution. This document covers four critical debugging scenarios with step-by-step problem descriptions, incorrect code, realistic error logs, corrected implementations, and in-depth explanations.

---

## Exercise 1: Port Conflict (`EADDRINUSE`)

### 1. Problem Description
An `EADDRINUSE` (Error: Address Already in Use) error occurs when an Express server attempts to bind and listen on a TCP port (e.g., port `3000`) that is already occupied by another running instance of Node.js, another service, or a previous terminal process that did not terminate gracefully.

### 2. Incorrect Code / Scenario
Attempting to launch two instances of the server simultaneously on port 3000:
```javascript
// server.js (Instance 1 already running on port 3000)
// Attempting to start another instance:
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### 3. Error Output
```text
node:events:497
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1904:16)
    at listenInCluster (node:net:1961:12)
    at Server.listen (node:net:2063:7)
    at Function.listen (c:\Users\AKSHAY\OneDrive\Desktop\backend\lab-03\node_modules\express\lib\application.js:635:24)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1940:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'EADDRINUSE',
  errno: -4091,
  syscall: 'listen',
  address: '::',
  port: 3000
}
```

### 4. Corrected Code & Resolution
There are two standard ways to resolve this issue:

#### Approach A: Configure Dynamic Port with Fallback
Allow the port to be dynamically set via environment variables:
```javascript
// Use environment variable PORT or fallback to an alternate port if 3000 is occupied
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

#### Approach B: Identify and Terminate the Blocking Process (Windows PowerShell)
Find and kill the process holding port 3000:
```powershell
# 1. Locate the process ID (PID) occupying port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object LocalPort, OwningProcess

# 2. Terminate the process by its PID
Stop-Process -Id <PID> -Force
```

### 5. Technical Explanation
Operating systems enforce port uniqueness per network interface. Only one socket listener can bind to an `IP:Port` combination at any given moment. When Node.js requests `app.listen(3000)`, the operating system kernel rejects the bind request with `EADDRINUSE`. Handling dynamic ports via `process.env.PORT` ensures container and cloud compatibility (such as Render, Heroku, or AWS), while terminating orphaned background tasks frees the port locally.

---

## Exercise 2: Wrong Import Path (`MODULE_NOT_FOUND`)

### 1. Problem Description
A `MODULE_NOT_FOUND` error occurs when a Node.js `require()` or `import` statement references a file path that does not exist, has incorrect casing, or omits relative path indicators (`./` or `../`).

### 2. Incorrect Code
```javascript
// server.js
// INCORRECT: Node treats 'database' without './' as an npm package in node_modules
const { initializeDatabase } = require('database');
```
Or pointing to an invalid relative directory:
```javascript
// INCORRECT: Target file is in current directory, not parent directory
const { initializeDatabase } = require('../database');
```

### 3. Error Output
```text
node:internal/modules/cjs/loader:1503
  throw err;
  ^

Error: Cannot find module 'database'
Require stack:
- C:\Users\AKSHAY\OneDrive\Desktop\backend\lab-03\server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1500:15)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1116:12)
    at Module._load (node:internal/modules/cjs/loader:1285:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1600:12)
    at require (node:internal/modules/helpers:153:16)
    at Object.<anonymous> (C:\Users\AKSHAY\OneDrive\Desktop\backend\lab-03\server.js:2:32) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'C:\\Users\\AKSHAY\\OneDrive\\Desktop\\backend\\lab-03\\server.js' ]
}
```

### 4. Corrected Code
```javascript
// server.js
// CORRECT: Explicit relative path pointing to the local file './database.js'
const { initializeDatabase } = require('./database');
```

### 5. Technical Explanation
Node.js uses the CommonJS module resolution algorithm:
1. Strings without `./`, `../`, or `/` (like `require('database')`) tell Node.js to look inside core modules, then sequentially upward through `node_modules` folders.
2. Local files **must** start with `./` (current directory) or `../` (parent directory).
3. On case-sensitive file systems (such as Linux production servers), `require('./Database')` will fail if the file is named `database.js`. Consistent lowercase naming and explicit relative paths prevent this issue.

---

## Exercise 3: SQLite Table-Name Typo (`no such table`)

### 1. Problem Description
SQLite throws an unhandled database error when an SQL query refers to a table name that does not exist in the database schema due to pluralization, spelling mistakes, or case mismatches.

### 2. Incorrect Code
```javascript
// server.js
// INCORRECT: Table in schema is named 'book' (singular), but query specifies 'books' (plural)
app.get('/books', async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM books;`;
    const books = await db.all(getBooksQuery);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
```

### 3. Error Output
```text
SQLITE_ERROR: no such table: books
--> HTTP Status: 500 Internal Server Error
Response Body:
{
  "error": "SQLITE_ERROR: no such table: books"
}
```

### 4. Corrected Code
```javascript
// server.js
// CORRECT: Using the exact table name 'book' defined in seed.sql schema
app.get('/books', async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM book;`;
    const books = await db.all(getBooksQuery);
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
```

### 5. Technical Explanation
Relational databases enforce strict identifier schema checks during query compilation. When SQLite prepares the statement `SELECT * FROM books`, it checks the master catalog table `sqlite_master`. Finding no table named `books` (only `book`), the SQL compiler immediately rejects the statement. Always check the schema definition (`CREATE TABLE book`) and verify the exact table name using the SQLite CLI or `sqlite_master` table:
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

---

## Exercise 4: Missing `await` Keyword in Async Database Calls

### 1. Problem Description
Methods on the `sqlite` wrapper (such as `db.get()`, `db.all()`, and `db.run()`) are asynchronous and return a `Promise`. Omitting the `await` keyword causes JavaScript to continue execution synchronously without waiting for the database query to finish.

### 2. Incorrect Code
```javascript
// server.js
// INCORRECT: Missing 'await' before db.get()
app.get('/books/:bookId', async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    
    // BUG: Missing await returns a Promise object immediately instead of the resolved row
    const book = db.get(getBookQuery, [bookId]);

    // This condition evaluates to false because a Promise object is never undefined!
    if (book === undefined) {
      return response.status(404).json({ error: 'Book Not Found' });
    }

    // Express serializes an unresolved Promise as empty object {} with status 200 OK!
    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
```

### 3. Unexpected Behavior & Output
When querying `GET /books/999` (a nonexistent book ID):
- **Expected:** `404 Not Found` with `{ "error": "Book Not Found" }`
- **Actual:** `200 OK` with `{}` (empty object)

When querying `GET /books/1`:
- **Expected:** `200 OK` with `{ "id": 1, "title": "The Pragmatic Programmer", ... }`
- **Actual:** `200 OK` with `{}` because `JSON.stringify(Promise)` evaluates to `{}`!

### 4. Corrected Code
```javascript
// server.js
// CORRECT: 'await' pauses function execution until the Promise resolves to the record or undefined
app.get('/books/:bookId', async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    
    // Resolved record or undefined
    const book = await db.get(getBookQuery, [bookId]);

    if (book === undefined) {
      return response.status(404).json({ error: 'Book Not Found' });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
```

### 5. Technical Explanation
In JavaScript's event loop, I/O operations (reading from disk or querying a database) are non-blocking. The SQLite wrapper library returns an unresolved `Promise<Pending>`. Without `await`, the function does not wait for the disk I/O to complete and immediately passes the Promise instance to `response.json()`. Because a Promise is a truthy object, `book === undefined` is false, bypassing 404 validation. `await` ensures the JavaScript runtime pauses the `async` function execution until the promise settles, properly returning the database row or `undefined`.

---

## Summary of Debugging Best Practices

| Issue | Error / Symptom | Root Cause | Best Practice Fix |
|---|---|---|---|
| Port In Use | `EADDRINUSE: port 3000` | Port already occupied | Use `process.env.PORT` fallback or kill orphaned PID |
| Missing Module | `MODULE_NOT_FOUND` | Missing `./` in path | Use explicit relative path `./database` |
| Table Typo | `no such table: books` | Query uses wrong table name | Match exact `book` table name from schema |
| Missing `await` | Returns `{}` or wrong status | Promise not resolved | Always `await` async database driver calls |

