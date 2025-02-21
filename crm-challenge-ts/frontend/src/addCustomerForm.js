import React, { useState } from 'react';
import axios from 'axios';
import config from './config';

/**
 * AddCustomerForm component allows users to add a new customer by filling out a form.
 * It handles form state, input changes, and form submission.
 */

function AddCustomerForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customer/add`;
      const response = await axios.post(url, formData);
      
      if (response.data.success) {
        setMessage('Customer added successfully!');
        setFormData({ firstName: '', lastName: '', email: '' });
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      setMessage('Failed to add customer. Please try again.');
    }
  };
  
  return (
    <div className="customer-form">
      <h2>Add New Customer</h2>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default AddCustomerForm;