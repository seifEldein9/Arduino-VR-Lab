import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={require("../../Assets/imgs/Untitled-1-11.png")} alt="Logo" />
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/store">Store</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://instagram.com">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 YourCompany. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
