/**
 * College Hub High-Throughput Mock API Server
 * Used for local load benchmarking, latency modeling, and SLA stress testing.
 */
const http = require('http');
const url = require('url');

const PORT = parseInt(process.env.PORT || '4000', 10);

// Sample dataset
const FEED_POSTS = [
  {
    id: 'post_1',
    author: 'Campus Poll',
    question: "Midterms next week! Where's the best spot to cram tonight? 📚☕️",
    options: [
      { label: 'Main Library (Quiet Floor)', votes: 220, percent: 65 },
      { label: 'Student Union Lounge', votes: 68, percent: 20 },
      { label: 'Campus Coffee Shop', votes: 54, percent: 15 },
    ],
    likes: 45,
    comments: 12,
  },
  {
    id: 'post_2',
    author: 'Kavya Sharma (CSE)',
    text: 'Anyone looking for study partners for Operating Systems final?',
    likes: 18,
    comments: 4,
  },
];

const DIRECTORY_STUDENTS = [
  { id: '101', name: 'Mani Rathan Raj', dept: 'CSE', year: '4th Year', status: 'online' },
  { id: '102', name: 'Aarav Patel', dept: 'ECE', year: '3rd Year', status: 'offline' },
  { id: '103', name: 'Priya Iyer', dept: 'BIO-TECH', year: '2nd Year', status: 'online' },
];

const MARKETPLACE_PRODUCTS = [
  { id: 'prod_1', title: 'Data Structures & Algorithms in Java', price: '₹450', category: 'Books' },
  { id: 'prod_2', title: 'Scientific Calculator fx-991EX', price: '₹950', category: 'Electronics' },
];

// Helper to simulate realistic network & database latency (Min: 50ms, Avg: ~250ms, Tail: ~1500ms)
function getSimulatedDelay() {
  const rand = Math.random();
  if (rand < 0.03) {
    // 3% tail latency spikes (up to 1500ms)
    return Math.floor(1000 + Math.random() * 500);
  } else if (rand < 0.15) {
    // 12% faster cache hits (50ms - 100ms)
    return Math.floor(50 + Math.random() * 50);
  } else {
    // 85% normal bell curve around 200ms - 280ms (Average ~250ms)
    return Math.floor(180 + Math.random() * 120);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Add standard JSON & CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const delayMs = getSimulatedDelay();

  setTimeout(() => {
    if (pathname === '/api/feed' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: FEED_POSTS }));
    } else if (pathname === '/api/directory' && method === 'GET') {
      const dept = parsedUrl.searchParams.get('dept');
      const results = dept ? DIRECTORY_STUDENTS.filter(s => s.dept === dept) : DIRECTORY_STUDENTS;
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', total: results.length, data: results }));
    } else if (pathname === '/api/marketplace' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', count: MARKETPLACE_PRODUCTS.length, data: MARKETPLACE_PRODUCTS }));
    } else if (pathname === '/api/chat/messages' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', thread: parsedUrl.searchParams.get('thread') || 'default', messages: [] }));
    } else if (pathname === '/api/health' || pathname === '/') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime(), server: 'CollegeHub-MockAPI/1.0' }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Endpoint Not Found', path: pathname }));
    }
  }, delayMs);
});

// Configure server connection pooling & high concurrency tuning
server.maxConnections = 2000;
server.keepAliveTimeout = 65000;

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m[College Hub Mock API Server]\x1b[0m listening on http://0.0.0.0:${PORT}`);
    console.log(`Concurrency capacity: 100+ virtual users | Latency profile: Min 50ms, Avg ~250ms, Max 1500ms`);
  });
}

module.exports = server;
