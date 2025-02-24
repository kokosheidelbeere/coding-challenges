import React, { useState, useEffect } from "react";
import config from "./config";
import axios from "axios";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [filterLastName, setFilterLastName] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const url = `${config.BACKEND_URL}:${config.BACKEND_PORT}/customers`;
        const response = await axios.get(url);
        setCustomers(response.data);
        console.log("Fetched customers:", response.data); // For debugging
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  const toggleRow = (customerId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(customerId)) {
      newExpandedRows.delete(customerId);
    } else {
      newExpandedRows.add(customerId);
    }
    setExpandedRows(newExpandedRows);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.last_name.toLowerCase().includes(filterLastName.toLowerCase())
  );

  return (
    <div className="customer-container">
      <input
        type="text"
        className="filter-input"
        placeholder="Filter by last name"
        value={filterLastName}
        onChange={(e) => setFilterLastName(e.target.value)}
      />

      <table className="customer-table">
        <thead>
          <tr>
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Customer ID</th>
            <th>TSS Count</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <React.Fragment key={customer.customer_id}>
              <tr>
                <td>
                  <button
                    className="expand-button"
                    onClick={() => toggleRow(customer.customer_id)}
                    style={{
                      display: customer.tss_list?.length ? "block" : "none",
                    }}
                  >
                    {expandedRows.has(customer.customer_id) ? "-" : "+"}
                  </button>
                </td>
                <td>{customer.first_name}</td>
                <td>{customer.last_name}</td>
                <td>{customer.mail}</td>
                <td>{customer.customer_id}</td>
                <td>{customer.tss_list?.length || 0}</td>
              </tr>
              {expandedRows.has(customer.customer_id) &&
                customer.tss_list?.length > 0 && (
                  <tr>
                    <td colSpan="6" className="tss-list">
                      <strong>TSS List:</strong>
                      <ul>
                        {customer.tss_list.map((tss, index) => (
                          <li key={index}>{tss}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
