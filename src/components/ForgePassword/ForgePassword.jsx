import React, { useState } from 'react';
import './ForgePassword.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  


function ForgePassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsEmailSubmitted(true);
        toast.success(("The code has been sent to your email"));
      } else {
        setErrorMessage(data.message || ("An error occurred"));
        toast.error(data.message || ("An error occurred"));
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage(("Error connecting to the server"));
      toast.error(("Error connecting to the server"));
    }
  };
 
  const handleCodeSubmit = async () => {
    
    setIsCodeSubmitted(true);
    toast.success(("The code has been successfully verified"));
  };
 
  const handlePasswordSubmit = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch('http://localhost:4000/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, newPassword, resetCode: code.join('') }),  
        });
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success(("Password updated successfully"));
          setTimeout(() => navigate('/'), 1000);   

        } else {
          setErrorMessage(data.message || ("An error occurred"));
          toast.error(data.message || ("An error occurred"));
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setErrorMessage(("Error connecting to the server"));
        toast.error(("Error connecting to the server"));
      }
    } else {
      toast.error(("Passwords do not match"));
    }
  };
 
  const handleCodeChange = (e, index) => {
    let newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

 
  const handleResendCode = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(("The code has been sent again"));
      } else {
        setErrorMessage(data.message || ("An error occurred"));
        toast.error(data.message || ("An error occurred"));
      }
    } catch (error) {
      console.error('Error resending code:', error);
      setErrorMessage(("Error connecting to the server"));
      toast.error(("Error connecting to the server"));
    }
  };

  return (
    <div className="forge-password-container">
      <div className="popup-overlay2">
        <div className="popup-container2">
          <Link to="/">
            <button className="close-btn">&times;</button>
          </Link>

          <div className="popup-left2">
            <div className="popup-image-container2">
              <img
                src={require('../../Assets/imgs/Forgot password-rafiki.png')}
                alt="Forgot Password"
                className="popup-image2"
              />
            </div>
          </div>

          <div className="popup-right2">
            {!isEmailSubmitted ? (
              <>
                <h2 className="title">{"Enter email"}</h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  placeholder={"Enter email"}
                />
                <button className="confirm-btn" onClick={handleEmailSubmit}>
                Send  
                </button>
              </>
            ) : !isCodeSubmitted ? (
              <>
                <h2 className="title">Enter the code</h2>
                <p className="subtitle">
                Please enter the code we sent. We've sent it to
                  <br />
                  <span className="email">{email}</span>
                </p>

                <div className="code-inputs">
                  {code.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="code-input"
                      value={value}
                      onChange={(e) => handleCodeChange(e, index)}
                    />
                  ))}
                </div>

                <p className="resend-code">
                Didn't receive the code? <span className="resend-link" onClick={handleResendCode}>Resend code</span>
                </p>

                <button className="confirm-btn" onClick={handleCodeSubmit}>
                Confirm
                </button>
              </>
            ) : (
              <>
                <h2 className="title">Enter new password</h2>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                  placeholder={"Enter new password"}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="password-input"
                  placeholder={"Confirm password"}
                />

                <button className="confirm-btn" onClick={handlePasswordSubmit}>
                {"Confirm"}
                </button>
              </>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgePassword;
