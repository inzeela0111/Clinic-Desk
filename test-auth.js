// using native fetch

async function test() {
  console.log('Registering user...');
  const res = await fetch('http://127.0.0.1:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Temp',
      email: `test${Date.now()}@temp.com`,
      phone: `+1${Date.now()}`.slice(0, 11),
      password: 'password123'
    })
  });
  
  const data = await res.json();
  console.log('Register Response:', data);
  
  if (!data.success) return;
  
  const token = data.data.token;
  console.log('\nFetching dashboard stats with token:', token.slice(0, 20) + '...');
  
  const statsRes = await fetch('http://127.0.0.1:5005/api/admin/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('Stats Response Status:', statsRes.status);
  const statsData = await statsRes.json();
  console.log('Stats Data:', statsData);
}

test();
