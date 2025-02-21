import React, { useState, useEffect } from 'react';
import config from './config';
import axios from 'axios';

// example customer id: 171c0f84-0b77-4cfc-96b1-368ddba2eb52

function fetchCustomer(customer_id) {
  const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customer`;
  axios.post(url, {customer_id: customer_id})
    .then((res) => {
      console.log(res.data);
    });
}

export default function CustomerTable(props) {
  const [customers, setCustomers] = useState([]);
  const [filterLastName, setFilterLastName] = useState('');

  // original code - kept but commented for later use
  // fetchCustomer('171c0f84-0b77-4cfc-96b1-368ddba2eb52');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customers`;
        const response = await axios.get(url);
        
        // Use a Set to remove duplicate entries based on customer_id
        const uniqueCustomers = Array.from(
          new Map(response.data.map((c) => [c.customer_id, c])).values()
        );
  
        setCustomers(uniqueCustomers);
        console.log("Filtered Unique Customers:", uniqueCustomers); // Debugging output
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      }
    };
  
    fetchCustomers();
  }, []);
  

  // Filter customers based on last name input
  const filteredCustomers = customers.filter(customer =>
    (customer.last_name || customer.lastName || "").toLowerCase().includes(filterLastName.toLowerCase())
  );  
  
  return (
    <div>
      <input
        type="text"
        placeholder="Filter by last name"
        value={filterLastName}
        onChange={(e) => setFilterLastName(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Customer ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.mail}</td>
              <td>{customer.customer_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}