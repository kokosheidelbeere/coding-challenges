import React, { useState } from "react";
import axios from "axios";
import config from "./config";

function AddCustomerForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s-']+$/;
    return nameRegex.test(name) && name.length >= 2;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
 
    // Clear error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });

    // Real-time validation
    if (value.trim() !== "") {
      if (name === "firstName" || name === "lastName") {
        if (!validateName(value)) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only letters, spaces, hyphens and apostrophes are allowed",
          }));
        }
      } else if (name === "email") {
        if (!validateEmail(value)) {
          setErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address",
          }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
    };
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName =
        "Only letters, spaces, hyphens and apostrophes are allowed";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName =
        "Only letters, spaces, hyphens and apostrophes are allowed";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customer/add`;
      const response = await axios.post(url, formData);

      if (response.data.success) {
        setMessage("Customer added successfully!");
        setFormData({ firstName: "", lastName: "", email: "" });
        setErrors({ firstName: "", lastName: "", email: "" });
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setMessage("Failed to add customer. Please try again.");
    }
  };

  return (
    <div className="customer-form">
      <h2>Add New Customer</h2>
      {message && (
        <p className={message.includes("success") ? "success" : "error"}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label>First Name:</label>
          <div className="input-container">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              minLength="2"
              pattern="[A-Za-z\s-']+"
            />
            {errors.firstName && (
              <span className="error-text">{errors.firstName}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <label>Last Name:</label>
          <div className="input-container">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              minLength="2"
              pattern="[A-Za-z\s-']+"
            />
            {errors.lastName && (
              <span className="error-text">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <label>Email:</label>
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="button-row">
          <button type="submit">Add Customer</button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomerForm;
