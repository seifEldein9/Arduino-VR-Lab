import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Profile.css';
import { jwtDecode } from 'jwt-decode';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
import './Profile.css';
 

function Profile() {
  const [activeTab, setActiveTab] = useState('Editaccount');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
 
  const token = localStorage.getItem("token"); 
 
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError(("The new passwords do not match"));
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        toast.error(("Token not found"));
        return;
      }
  
      const response = await fetch('http://localhost:4000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(("Password changed successfully"));
      } else {
        toast.error(data.message || ("An error occurred while changing the password"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(("An error occurred while changing the password"));
    }
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfileData();
  }, []);

  const content = {
    security: {
      title: ("Security"),
      content: (
        <div style={{ marginLeft: "40px" }}>
          <div className="profile-info">
            <div className="profile-avatar">N</div>
            <div>
              <p className="profile-name">{user?.name || ("Username")}</p>
              <p className="profile-phone">{user?.phone || ("Phone number")}</p>
            </div>
          </div>

          <div className="edit-form">
            <div className="input-group">
              <label>{("Old password")}</label>
              <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder={("Enter old password")}
      />
                  </div>
            <div className="horizontal-group">
              <div className="input-group">
                <label>{("Confirm password")}</label>
                      <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={("Enter new password")}
            />              
            </div>
              <div className="input-group">
                <label>{("New password")}</label>
                <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={("Re-enter new password")}
      />
                    </div>
            </div>
            <p className="note">
            {("You must enter the old password before changing it")}
                        </p>
            {error && <p className="error-message">{error}</p>}
    <button className="save-button" onClick={handlePasswordChange}>
    {("Change password")}
        </button>
    <ToastContainer />
              </div>
        </div>
      ),
    },
 
    Editaccount: {
      title:  ("Edit Profile"),
      content: (
        <div style={{ marginLeft: "40px" }}>
          <div className="profile-info">
            <div className="profile-avatar">N</div>
            <div>
              <p className="profile-name">{user?.name ||  ("Username")}</p>
              <p className="profile-phone">{user?.phone || ("Phone number")}</p>
            </div>
          </div>

          <div className="edit-form">
            <div className="horizontal-group">
              <div className="input-group">
                <label> {("Email")}</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label> {("Name")}</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
            </div>
            <div className="horizontal-group">
              <div className="input-group">
                <label></label>
              </div>
              <div className="input-group">
                <label> {("Phone number")}</label>
                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
            </div>



            <button
  className="save-button"
  onClick={async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        toast.error( ("Token not found")); 
        return;
      }

      const response = await fetch('http://localhost:4000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success( ("Profile updated successfully")); 
      } else {
        console.error('Error:', data.message);
      toast.error(data.message);      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(("An error occurred while updating the profile"));  
    }
  }}
>
{("Edit Profile")}
</button>
<ToastContainer />
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="profile-container6">
  <Navbar />
      <h2 className="profile-title"> {("Personal Profile")}</h2>

      <div className="content-section3"> 
        <div className="nav-buttons2">
          {Object.keys(content).map((key) => (
            <button
              key={key}
              className={activeTab === key ? 'active-tab' : ''}
              onClick={() => setActiveTab(key)}
            >
              {content[key].title}
            </button>
          ))}
        </div>

        <div className="dynamic-content">{content[activeTab].content}</div>
      </div>
    </div>
  );
}

export default Profile;
