import React, { useState, useRef } from "react";
 
import Navbar from "../Navbar/Navbar";
import "./Contact.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
 
 

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/Contact/add-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('تم إرسال الرسالة بنجاح.', );
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        toast.error(data.message || 'حدث خطأ أثناء إرسال الرسالة.' );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطأ في الاتصال بالخادم.' );
    }
  };

  return (
    <div className="home-container">
      <Navbar />
 
      <div className="ret Contact">
      <h1>Contact</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input-field2"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          className="textarea-field"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <ToastContainer />
    </div>
 
    </div>
  );
}

export default Contact;
