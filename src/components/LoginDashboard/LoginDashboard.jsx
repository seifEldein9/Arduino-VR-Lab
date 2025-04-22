import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginDashboard.css';  
function LoginDashboard({ setIsLoggedIn }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (name === 'name' && password === '11111') {
      setIsLoggedIn(true);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container2">
      <h2>Login Dashboard</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginDashboard;
