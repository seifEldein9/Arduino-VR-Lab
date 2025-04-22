import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Commentary.css";

function Commentary() {
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
  });
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:4000/chat/");
        setGroups(response.data);
        if (response.data.length > 0) {
          setGroup(response.data[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:4000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Profile Data:", response.data);  
        setUsername(response.data.user.name || "Unknown");
    

      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };
    fetchUsername();
  }, []);
  

  useEffect(() => {
    if (group) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/chat/${group}`);
          setMessages(response.data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };
      fetchMessages();
    }
  }, [group]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(`http://localhost:4000/chat/${group}/send`, {
        username,
        message,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { username, message, timestamp: new Date() },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="home-container3">
      <Navbar />
      <div className="chat-wrapper">
        <div className="sidebar">
          <h3>Groups</h3>
          <ul>
            {groups.length > 0 ? (
              groups.map((g, index) => (
                <li
                  key={index}
                  className={group === g.name ? "active-group" : ""}
                  onClick={() => setGroup(g.name)}
                >
                  {g.name}
                </li>
              ))
            ) : (
              <li>No groups available</li>
            )}
          </ul>
        </div>
        <div className="chat-container">
          <h2>Group: {group}</h2>
          <h4 className="username-display">User: {username}</h4>
        
<div className="messages">
  {messages.map((msg, index) => (
    <div 
      key={index} 
      className={`message ${msg.username === username ? 'current-user' : 'other-user'}`}
    >
      <div className="message-content">
        {msg.username !== username && <strong>{msg.username}:</strong>}
        <span className="message-text">{msg.message}</span>
        <span className="timestamp">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  ))}
</div>
          <div className="input-area">
            <input
              type="text"
              value={message}
              className="send2"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="send">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Commentary;
