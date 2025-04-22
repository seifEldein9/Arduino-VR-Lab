import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
 

 
 

import Login from './components/login/Login';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';


import Dashboard from './components/Dashboard/Dashboard';
import LoginDashboard from './components/LoginDashboard/LoginDashboard';

import ForgePassword from './components/ForgePassword/ForgePassword';
import Commentary from './components/Commentary/Commentary';
import Store from './components/Store/Store';
import StoreD from './components/StoreD/StoreD';

import Contact from './components/Contact/Contact';

import { useNavigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>You must be logged in to access this page.</p>
        <Navigate to="/LoginDashboard" />  
      </div>
    );
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const handleLoginStatusChange = (status) => {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
    setIsLoggedIn(status);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
 

        
<Route path="/ForgePassword" element={<ForgePassword />} />

        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />
        

        <Route path="/Commentary" element={<Commentary />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/StoreD/:id" element={<StoreD />} />

        <Route path="/Contact" element={<Contact />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />         
        <Route
        path="/LoginDashboard"
        element={<LoginDashboard setIsLoggedIn={handleLoginStatusChange} />}
      />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
