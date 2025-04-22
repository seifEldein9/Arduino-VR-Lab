import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("members");
  const [userss, setUserss] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    ProductStatus: "متوفر", // قيمة افتراضية
    address: "",
    Description: "",
    image: null,
  });
  useEffect(() => {
    fetch("http://localhost:4000/productrequest/")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const fetchData = async (url, setData) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error("فشل في جلب البيانات");
      const data = await response.json();
      setData(data.users || data.userss || data.contacts || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("ProductStatus", formData.ProductStatus);
    data.append("address", formData.address);
    data.append("Description", formData.Description);
    data.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:4000/Product/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product added:", response.data);
      toast.success("تمت إضافة المنتج بنجاح!");

      setFormData({
        title: "",
        price: "",
        ProductStatus: "متوفر",
        address: "",
        Description: "",
        image: null,
      });
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("فشل في إضافة المنتج. حاول مرة أخرى.");
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    fetchData("http://localhost:4000/auth/userss", setUserss);
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/Contact/get-messages"
        );
        if (!response.ok) {
          throw new Error("");
        }
        const data = await response.json();
        setMessages(data.contacts || []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (activeSection === "message") {
      fetchMessages();
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "members":
        return (
          <div className="Dash_Board">
            <h2>Members Dashboard</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {userss.length > 0 ? (
                  userss.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">لا توجد بيانات لعرضها</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "message":
        return (
          <div className="Dash_Board">
            <h2>Messages</h2>
            {messages.length > 0 ? (
              <table className="message-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg._id}>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.Message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>لا توجد رسائل لعرضها</p>
            )}
          </div>
        );
      case "Addproduct":
        return (
          <div className="Dash_Board">
            <h2>إضافة كتاب جديد</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>العنوان:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>السعر:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>حالة المنتج:</label>
                <select
                  name="ProductStatus"
                  value={formData.ProductStatus}
                  onChange={handleChange}
                >
                  <option value="new">جديد</option>
                  <option value="used">مستعمل</option>
                </select>
              </div>

              <div className="form-group">
                <label>العنوان :</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>الوصف:</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>صورة الغلاف:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                إضافة الكتاب
              </button>
            </form>
          </div>
        );

      case "productrequest":
        return (
          <div className="Dash_Board">
            <h2>Product Requests</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{request.phone}</td>
                    <td>{request.ProductTitle}</td>
                    <td>${request.Productprice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div>Members Section</div>;
    }
  };
  return (
    <main className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setActiveSection("members")}>Members</li>
            <li onClick={() => setActiveSection("Addproduct")}>Add product</li>
            <li onClick={() => setActiveSection("message")}>Message</li>
            <li onClick={() => setActiveSection("productrequest")}>
              productrequest
            </li>
          </ul>
        </aside>
        <section className="main-content">{renderSection()}</section>
      </div>
    </main>
  );
}

export default Dashboard;
