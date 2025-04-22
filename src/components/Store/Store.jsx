import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import "./Store.css";

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // لإعادة التوجيه

  useEffect(() => {
    fetch("http://localhost:4000/Product/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSubmitRequest = async (product) => {
    const token = localStorage.getItem("token"); // جلب التوكين من التخزين
    if (!token) {
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
      return;
    }

    // استخراج بيانات المستخدم من التوكين
    let user;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      user = JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const requestData = {
      name: user.name,
      email: user.email,
      phone: user.phone || "Not Provided",
      ProductTitle: product.title,
      Productprice: product.price,
    };

    try {
      const response = await fetch("http://localhost:4000/productrequest/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // إرسال التوكين مع الطلب
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to submit request");

      alert("Product request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="home-container4">
      <Navbar />
      <div className="home-container2">
        <div className="filter-sidebar">
          <h2>Categories</h2>
          <ul>
            <li>VR</li>
            <li>Other</li>
          </ul>
        </div>
        <div className="products-container">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <div className="product-details">
                <div className="product-title">{product.title}</div>
                <div className="product-price">{product.price} EGP</div>
                <div className="product-status">{product.ProductStatus}</div>
                <div className="product-location">{product.address}</div>
                <button
                  className="chat-button"
                  onClick={() => handleSubmitRequest(product)}
                >
                  Submit a product request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Store;
