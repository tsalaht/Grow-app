// Test script to verify API endpoints
// Run this in your browser console or Node.js environment

const API_BASE = 'https://api.growupe.com/api';

// Test endpoints - using the actual backend endpoints
const endpoints = [
  // Tasks
  { method: 'GET', path: '/get-all-tasks', description: 'Get all tasks' },
  { method: 'POST', path: '/create-task', description: 'Create task' },
  {
    method: 'GET',
    path: '/get-tasks?type=daily',
    description: 'Get daily tasks',
  },
  {
    method: 'GET',
    path: '/get-tasks-by-category?category=daily',
    description: 'Get tasks by category',
  },

  // Finance
  {
    method: 'GET',
    path: '/finance-overview?month=2024-01',
    description: 'Get finance overview',
  },
  { method: 'GET', path: '/all-expenses', description: 'Get all expenses' },
  {
    method: 'GET',
    path: '/get-income?month=2024-01',
    description: 'Get income',
  },

  // Notes
  { method: 'GET', path: '/get-all-notes', description: 'Get all notes' },
  { method: 'GET', path: '/get-pinned-notes', description: 'Get pinned notes' },

  // Goals
  { method: 'GET', path: '/get-goals', description: 'Get all goals' },
  {
    method: 'GET',
    path: '/get-goals-by-type?type=savings',
    description: 'Get goals by type',
  },

  // Notifications
  { method: 'GET', path: '/get-noti', description: 'Get notifications' },
  {
    method: 'GET',
    path: '/noti-settings',
    description: 'Get notification settings',
  },
];

async function testEndpoint(method, path, description) {
  try {
    const url = `${API_BASE}${path}`;
    console.log(`\n🧪 Testing: ${method} ${path}`);
    console.log(`📝 Description: ${description}`);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success:`, data);
    } else {
      console.log(`❌ Error: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        console.log(`🔐 Authentication required`);
      } else if (response.status === 404) {
        console.log(`🔍 Endpoint not found`);
      }
    }
  } catch (error) {
    console.log(`💥 Network error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API endpoint tests...');
  console.log(`📍 Base URL: ${API_BASE}`);

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.method, endpoint.path, endpoint.description);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n🏁 All tests completed!');
}

// Run the tests
runTests();
