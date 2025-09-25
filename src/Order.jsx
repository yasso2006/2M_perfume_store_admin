import React, { useState, useEffect } from "react";
import axios from "axios";

function Order() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time,setTime] = useState("")

  const addOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data);
      setCart(orders.cart);
      
    } catch (err) {
      console.log("API Error:", err);
      setError("Failed to load orders. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    addOrders();
  }, []);

  async function Delete(id) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/delete/order`, { id });
    } catch (err) {
      console.log(err);
    }
    addOrders();
  }
  function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
  return (
    <div style={{ padding: "1rem 2rem" }} className="contact">
      <h1 style={{ color: "#eaeaea", marginBottom: "2rem" }}>
        Orders Management
      </h1>

      {loading && <p style={{ color: "#eaeaea" }}>Loading orders...</p>}

      {error && (
        <div
          style={{
            background: "#d9534f",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p style={{ color: "#eaeaea" }}>No orders found.</p>
      )}

      {orders.map((order, index) => (
        <div className="contact-card" key={index}>
          <h3>
            Name: {order.first} {order.second}
          </h3>
          <h5>Phone: {order.phone}</h5>
          <h5>Adress: {order.adress}</h5>
          <p>Building: {order.building}</p>
          <p>Apartment: {order.apart}</p>
          <p>Time: {formatDate(order.created_at)}</p>
          <div className="btn__actions">
            <button
              className="btn btn--cart"
              onClick={() => {
                setCart(order.cart || []);
                setOpen(true);
              }}
            >
              Cart
            </button>
            <button
              className="btn btn--delete"
              onClick={() => Delete(order.id)}
            >
              remove
            </button>
          </div>
        </div>
      ))}

      {open && (
        <div className="cart__container">
          <h2>Cart Items</h2>
          {cart && cart.length > 0 ? (
            cart.map((product, index) => (
              <div className="cart__item" key={index}>
                <div className="item__image">
                  <img src={product.image1} alt={product.name} />
                </div>
                <div className="item__details">
                  <h3>{product.name}</h3>
                  <div className="item__quantity">
                    <p>Quantity: {product.quantity}</p>
                    <div className="item__price">
                      <span>{product.price} L.E</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No items in cart</p>
          )}
          <button className="btn btn--primary" onClick={() => setOpen(false)}>
            Close Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default Order;
