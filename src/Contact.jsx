import React, { useEffect, useState } from "react";
import axios from "axios";

function Contact() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function addContact() {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contact`);
      setUsers(res.data);
    } catch (err) {
      console.log("API Error:", err);
      setError(
        "Failed to load contacts. Please check if the server is running."
      );
      
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    addContact();
  }, []);

  async function Delete(id) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/delete/contact`, { id });
    } catch (err) {
      console.log(err);
    }
    addContact();
  }

  return (
    <div style={{ padding: "1rem 2rem" }} className="contact">
      <h1 style={{ color: "#eaeaea", marginBottom: "2rem" }}>
        Contact Messages
      </h1>

      {loading && <p style={{ color: "#eaeaea" }}>Loading contacts...</p>}

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

      {!loading && users.length === 0 && (
        <p style={{ color: "#eaeaea" }}>No contacts found.</p>
      )}

      {users && users.length > 0
        ? users.map((user, index) => {
            return (
              <div className="contact-card" key={index}>
                <h3>Name: {user.name}</h3>
                <h5>Phone: {user.phone}</h5>
                <h5>Email: {user.email}</h5>
                <p>Message: {user.message}</p>
                <button
                  className="btn btn--delete"
                  onClick={() => Delete(user.id)}
                >
                  remove
                </button>
              </div>
            );
          })
        : !loading && <h1 style={{ color: "#eaeaea" }}>No Contacts</h1>}
    </div>
  );
}
export default Contact;
