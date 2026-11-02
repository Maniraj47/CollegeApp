/**
 * User Journeys for College Hub Load Testing
 * Simulates realistic multi-step student browsing behavior.
 */
module.exports = [
  {
    name: 'Browse Campus Feed & View Midterm Poll',
    weight: 40,
    steps: [
      { method: 'GET', path: '/api/feed' },
    ],
  },
  {
    name: 'Search Campus Directory by Department',
    weight: 25,
    steps: [
      { method: 'GET', path: '/api/directory?dept=CSE' },
      { method: 'GET', path: '/api/directory?dept=ECE' },
    ],
  },
  {
    name: 'Browse Campus Marketplace Listings',
    weight: 20,
    steps: [
      { method: 'GET', path: '/api/marketplace' },
    ],
  },
  {
    name: 'Poll Active Chat Message History',
    weight: 15,
    steps: [
      { method: 'GET', path: '/api/chat/messages?thread=cs_general' },
    ],
  },
];

