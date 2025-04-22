import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });
  
      const text = await response.text(); // قراءة النص بدلاً من JSON مباشرةً
      console.log("Raw Response:", text); // تحقق من الاستجابة الخام
  
      const data = text ? JSON.parse(text) : {}; // تحليل JSON إذا كان متاحًا
  
      if (response.ok) {
        toast.success(data.message || "Account created successfully!");
        navigate('/Login');
      } else {
        toast.error(data.message || "Failed to create an account.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup">
        <div className="signup-form">
          <div className="home-link">
            <Link to="/" className="home-link-button">Go back</Link>
          </div>
          <h2>Create an account</h2>
          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="input-field3"
              required
            />
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="input-field3"
              required
            />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="input-field3"
              required
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field3"
              required
            />
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Create an account'}
            </button>
          </form>
          <div className="login-link">
            <p>Do you have an account? <Link to="/login" className="login-link-button">Login</Link></p>
          </div>
        </div>
        <div className="signup-image">
          <img src={require('../../Assets/imgs/Untitled-2-02.webp')} alt="Signup" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
