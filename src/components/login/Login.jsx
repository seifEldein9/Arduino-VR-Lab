import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clientId = "708459077533-qmf13nat9865tumrtd3jtnvhr5ccs7kc.apps.googleusercontent.com";

  const handleGoogleLoginSuccess = async (response) => {
    console.log('Google login response:', response);
    try {
      const googleToken = response.credential;

      const res = await fetch('https://http://localhost:4000/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "An error occurred while logging in with Google.");
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success("Login successful!");
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Google login failed.");
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error('Google login error:', error);
    toast.error('Google login failed.');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success("Login successful!");
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <div className="login">
          <div className="login-form">
            <div className="home-link">
              <Link to="/" className="home-link-button">Go back</Link>
            </div>

            <h2>Login</h2>
            {/* <div style={{ marginBottom: "20px" }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
              />
            </div> */}
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Email Or Phone"
              className="input-field3"
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field3"
            />
             <div className="forgot-password-link">
  <Link to="/ForgePassword" className="link-style">
    Did you forget your password?
  </Link>
</div>

            <button onClick={handleLoginSubmit} className="login-button2" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="register-link">
              <p>Don't have an account? <Link to="/signup" className="register-link-button">Create a new account</Link></p>
            </div>
          </div>

          <div className="login-image">
            <img src={require('../../Assets/imgs/Untitled-2-02.webp')} alt="Login" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </GoogleOAuthProvider>
  );
}

export default Login;
