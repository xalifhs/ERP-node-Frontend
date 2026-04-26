import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('user');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        const message = errJson.message || 'Invalid credentials';
        throw new Error(message);
      }

      const data = await res.json();
      console.log('Login success:', data);

      const userData = data.user || data.company;

      if (data.token && userData) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', type);
        localStorage.setItem('userName', userData.name || '');
        localStorage.setItem('userEmail', userData.email || '');

        if (onLogin) onLogin(userData);
        navigate('/dashboard');
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const isUser = type === 'user';

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>

        <div className="user-type-toggle">
          <button
            type="button"
            onClick={() => setType('user')}
            className={isUser ? 'active' : ''}
          >
            👤 User
          </button>
          <button
            type="button"
            onClick={() => setType('company')}
            className={!isUser ? 'active' : ''}
          >
            🏢 Company
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
