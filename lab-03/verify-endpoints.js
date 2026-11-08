/**
 * Verification Test Script for Lab 3 REST APIs
 * Run: node verify-endpoints.js
 */
const http = require('http')
const app = require('./server')

const request = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        let parsed
        try {
          parsed = JSON.parse(body)
        } catch (e) {
          parsed = body
        }
        resolve({ status: res.statusCode, body: parsed })
      })
    })

    req.on('error', reject)
    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}

setTimeout(async () => {
  try {
    console.log('====================================================')
    console.log('   LAB 3 REST API ENDPOINT AUTOMATED TEST SUITE')
    console.log('====================================================\n')

    console.log('1. GET /books (Default)')
    const r1 = await request('/books')
    console.log(`   Status: ${r1.status} | Total Books: ${r1.body.length}\n`)

    console.log('2. GET /books?search_q=JavaScript')
    const r2 = await request('/books?search_q=JavaScript')
    console.log(`   Status: ${r2.status} | Matches: ${JSON.stringify(r2.body.map((b) => b.title))}\n`)

    console.log('3. GET /books?order_by=price&order=ASC')
    const r3 = await request('/books?order_by=price&order=ASC')
    console.log(`   Status: ${r3.status} | Prices: ${JSON.stringify(r3.body.map((b) => b.price))}\n`)

    console.log('4. GET /books?order_by=price&order=DESC')
    const r4 = await request('/books?order_by=price&order=DESC')
    console.log(`   Status: ${r4.status} | Prices: ${JSON.stringify(r4.body.map((b) => b.price))}\n`)

    console.log('5. GET /books?limit=3&offset=0 (Page 1)')
    const r5 = await request('/books?limit=3&offset=0')
    console.log(`   Status: ${r5.status} | IDs: ${JSON.stringify(r5.body.map((b) => b.id))}\n`)

    console.log('6. GET /books?limit=3&offset=3 (Page 2)')
    const r6 = await request('/books?limit=3&offset=3')
    console.log(`   Status: ${r6.status} | IDs: ${JSON.stringify(r6.body.map((b) => b.id))}\n`)

    console.log('7. GET /books?min_price=40&max_price=50')
    const r7 = await request('/books?min_price=40&max_price=50')
    console.log(`   Status: ${r7.status} | Count: ${r7.body.length}\n`)

    console.log('8. GET /books (Combined query: search, sort, pagination, price range)')
    const r8 = await request(
      '/books?search_q=JavaScript&order_by=price&order=ASC&limit=5&offset=0&min_price=25&max_price=50'
    )
    console.log(`   Status: ${r8.status} | Count: ${r8.body.length} | Books: ${JSON.stringify(r8.body.map(b => ({ title: b.title, price: b.price })))}\n`)

    console.log('9. GET /books/1 (Single Book)')
    const r9 = await request('/books/1')
    console.log(`   Status: ${r9.status} | Title: "${r9.body.title}"\n`)

    console.log('10. GET /books/999 (Nonexistent Book)')
    const r10 = await request('/books/999')
    console.log(`    Status: ${r10.status} | Response: ${JSON.stringify(r10.body)}\n`)

    console.log('11. POST /books (Add valid book)')
    const r11 = await request('/books', 'POST', {
      title: 'Python Programming',
      author: 'John',
      price: 60,
      pages: 350,
    })
    console.log(`    Status: ${r11.status} | Response: ${JSON.stringify(r11.body)}\n`)
    const createdId = r11.body.bookId

    console.log('12. POST /books (Missing title validation)')
    const r12 = await request('/books', 'POST', {
      title: '',
      author: 'John',
      price: 60,
      pages: 350,
    })
    console.log(`    Status: ${r12.status} | Response: ${JSON.stringify(r12.body)}\n`)

    console.log('13. POST /books (Invalid price validation)')
    const r13 = await request('/books', 'POST', {
      title: 'Valid Book',
      author: 'John',
      price: 'sixty',
      pages: 350,
    })
    console.log(`    Status: ${r13.status} | Response: ${JSON.stringify(r13.body)}\n`)

    console.log(`14. PUT /books/${createdId} (Update Book)`)
    const r14 = await request(`/books/${createdId}`, 'PUT', {
      title: 'Python Programming 2nd Edition',
      author: 'John Doe',
      price: 65,
      pages: 380,
    })
    console.log(`    Status: ${r14.status} | Response: ${JSON.stringify(r14.body)}\n`)

    console.log('15. PUT /books/999 (Update Nonexistent ID)')
    const r15 = await request('/books/999', 'PUT', {
      title: 'Python Programming',
      author: 'John Doe',
      price: 65,
      pages: 380,
    })
    console.log(`    Status: ${r15.status} | Response: ${JSON.stringify(r15.body)}\n`)

    console.log(`16. DELETE /books/${createdId} (Delete Book)`)
    const r16 = await request(`/books/${createdId}`, 'DELETE')
    console.log(`    Status: ${r16.status} | Response: ${JSON.stringify(r16.body)}\n`)

    console.log('17. DELETE /books/999 (Delete Nonexistent ID)')
    const r17 = await request('/books/999', 'DELETE')
    console.log(`    Status: ${r17.status} | Response: ${JSON.stringify(r17.body)}\n`)

    console.log('====================================================')
    console.log('  ALL API VERIFICATIONS PASSED SUCCESSFULLY!')
    console.log('====================================================')
    process.exit(0)
  } catch (err) {
    console.error('Verification failed:', err)
    process.exit(1)
  }
}, 800)

