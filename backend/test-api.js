const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'admin@example.com',
      password: 'password123',
      roleName: 'admin'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    const token = registerResponse.data.token;

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test get profile (with token)
    console.log('\n4. Testing get profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.user.email);

    // Test get all roles
    console.log('\n5. Testing get all roles...');
    const rolesResponse = await axios.get(`${BASE_URL}/users/roles/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Roles retrieved:', rolesResponse.data.roles.length, 'roles found');

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI(); 