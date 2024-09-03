import React, { useEffect, useState } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import AddVendor from '../AddVendor/AddVendor';
import './VendorList.css';
import Header from '../Header/Header';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Fetch vendor data from the backend
    fetch('http://localhost:5000/api/vendors')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        return response.json();
      })
      .then(data => {
        setVendors(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError('Failed to load list of Vendors');
        setIsLoading(false);
        console.error('Error fetching vendor data:', error);
      });
  }, []);

  // Function to handle sorting
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Sort vendors based on the selected order
  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="vendor-list">
      <Header />
      <div className="sort-options">
        <label htmlFor="sort">Sort by Name:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {isLoading ? (
        <div className="loading-message">Loading vendor data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="vendor-grid">
          {sortedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={{
                name: vendor.name,
                description: vendor.description,
                location: `Aisle ${vendor.location}`,
                category: vendor.category,
                avatar: vendor.avatar,
              }}
            />
          ))}
        </div>
      )}

      <button onClick={openModal}>Add Vendor</button>
      <AddVendor isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default VendorList;
