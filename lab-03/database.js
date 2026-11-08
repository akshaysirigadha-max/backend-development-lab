const path = require('path')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// Path to SQLite database file
const dbPath = path.join(__dirname, 'database.db')

/**
 * Initializes and connects to the SQLite database.
 * Reuses existing database.db and ensures the 'book' table and initial seed data exist.
 */
const initializeDatabase = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Ensure table exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL,
      pages INTEGER NOT NULL
    );
  `)

  // Check if seed data exists; insert only if empty to avoid duplicate records
  const countRow = await db.get(`SELECT COUNT(*) AS count FROM book;`)
  if (countRow.count === 0) {
    await db.exec(`
      INSERT INTO book (title, author, price, pages) VALUES
      ('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 45, 352),
      ('Clean Code', 'Robert C. Martin', 40, 464),
      ('JavaScript: The Good Parts', 'Douglas Crockford', 30, 176),
      ('Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 55, 395),
      ('Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 85, 1312),
      ('You Don''t Know JS Yet', 'Kyle Simpson', 25, 142),
      ('Designing Data-Intensive Applications', 'Martin Kleppmann', 50, 616),
      ('Refactoring: Improving the Design of Existing Code', 'Martin Fowler', 48, 448),
      ('Node.js Design Patterns', 'Mario Casciaro & Luciano Mammino', 42, 520),
      ('Eloquent JavaScript', 'Marijn Haverbeke', 35, 472);
    `)
    console.log('Database seeded with 10 initial book records.')
  }

  return db
}

module.exports = {
  initializeDatabase,
  dbPath,
}
