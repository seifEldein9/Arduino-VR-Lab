import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./StoreD.css";

const products = [
  {
    id: 1,
    image: "../../Assets/imgs/Untitled-1-11.png",
    title: "Excellent car charger",
    price: "10,000 EGP",
    status: "NEW",
    location: "Cairo, Fifth Settlement",
    description: "This is an excellent car charger with fast charging capabilities.",
  },
  {
    id: 2,
    image: "../../Assets/imgs/Untitled-1-11.png",
    title: "Premium car charger",
    price: "15,000 EGP",
    status: "USED",
    location: "Alexandria, Smouha",
    description: "A premium car charger in excellent condition.",
  },
];

function StoreD() {
  const { id } = useParams();
  const product = products.find((item) => item.id === parseInt(id));

  return (
    <div className="home-container4">
      <Navbar />
      <div className="product-detail-container">
        {product ? (
          <>
            <img src={require("./../../Assets/imgs/Learn Python for Beginners.png")} alt={product.title} className="product-detail-image" />
            <div className="product-detail-info">
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <div className="product-detail-price">Price: {product.price}</div>
              <div className="product-detail-status">Status: {product.status}</div>
              <div className="product-detail-location">Location: {product.location}</div>
            </div>
          </>
        ) : (
          <p>Product not found.</p>
        )}
      </div>
    </div>
  );
}

export default StoreD;
