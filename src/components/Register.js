import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function Register() {
  const [type, setType] = useState('company'); // default to company
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError(true);
      setMessage('🚫 All fields are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, type }),
      });
      const errJson = await res.json();
      if (!res.ok) {
        //const errText = await res.text();
        //throw new Error(errText || 'Registration failed');
        throw new Error(errJson.message || 'Registration failed');
      }

      //await res.json();
      setError(false);
      setMessage('✅ Registration successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(true);
      setMessage(`🚫 ${err.message}`);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (message) setMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{type === 'company' ? '🏢 Register Company' : '👤 Register User'}</h2>

        <div className="user-type-toggle">
          <button
            type="button"
            onClick={() => setType('company')}
            className={type === 'company' ? 'active' : ''}
          >
            🏢 Company
          </button>
          <button
            type="button"
            onClick={() => setType('user')}
            className={type === 'user' ? 'active' : ''}
          >
            👤 User
          </button>
        </div>

        <input
          type="text"
          className="styled-input"
          placeholder={type === 'company' ? 'Company Name' : 'Full Name'}
          value={name}
          onChange={handleInputChange(setName)}
          required
        />
        <input
          type="email"
          className="styled-input"
          placeholder="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          required
        />
        <input
          type="password"
          className="styled-input"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          required
        />


        <button onClick={handleRegister}>Register</button>

        {message && (
          <p className={error ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        <p className="register-link">
          <Link to="/">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
