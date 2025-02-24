import React, { useState } from "react";
import axios from "axios";
import config from "./config";

function AddTssForm() {
  const [formData, setFormData] = useState({
    customerId: "",
    tssId: "", // Optional, will be generated if not provided
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.customerId.trim()) {
      setError("Customer ID is required");
      return;
    }

    try {
      const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customer/add-tss`;
      const response = await axios.post(url, {
        customerId: formData.customerId,
        tssId: formData.tssId.trim() || null,
      });

      if (response.data.success) {
        setMessage("TSS added successfully!");
        setFormData({ customerId: "", tssId: "" });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Customer not found. Please check the Customer ID.");
      } else {
        setError("Failed to add TSS. Please try again.");
      }
      console.error("Error adding TSS:", err);
    }
  };

  return (
    <div className="customer-form">
      <h2>Add TSS to Customer</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Customer ID:</label>
          <div className="input-container">
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              placeholder="Enter existing customer ID"
            />
          </div>
        </div>

        <div className="form-row">
          <label>TSS ID:</label>
          <div className="input-container">
            <input
              type="text"
              name="tssId"
              value={formData.tssId}
              onChange={handleChange}
              placeholder="Optional - will be generated if empty"
            />
          </div>
        </div>

        <div className="button-row">
          <button type="submit">Add TSS</button>
        </div>
      </form>
    </div>
  );
}

export default AddTssForm;
