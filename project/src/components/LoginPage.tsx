import React, { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // This clears old login data (token and role) when login page opens
useEffect(() => {
  localStorage.clear();
}, []);


  // Clear previous login info on load
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
  
      const data = await res.json();
      console.log("Login response data:", data);
  
      if (res.ok) {
        const role = data.user.role.toLowerCase(); // Normalize role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
  
        if (role === 'admin') {
          navigate('/admin-dashboard'); // ✅ Only go to admin dashboard
        } else {
          alert('Access Denied: You are not authorized to access this page.');
        }
      } else {
        alert(data.message || 'Login failed');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Try again.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 ml-2">Payroll Management</h1>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
