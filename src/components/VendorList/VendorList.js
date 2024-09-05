import React, { useEffect, useState } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import AddVendor from '../AddVendor/AddVendor';
import VendorMap from '../VendorMap/VendorMap'; // Import the VendorMap component
import './VendorList.css';
import Header from '../Header/Header';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [sortOrder, setSortOrder] = useState('location'); // 'asc', 'desc', 'new', 'old', 'location'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); // State for controlling the Vendor Map
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openMap = () => setIsMapOpen(true); // Function to open the Vendor Map
  const closeMap = () => setIsMapOpen(false); // Function to close the Vendor Map

  useEffect(() => {
    // Fetch vendor data from the backend with the sort parameter
    fetch(`http://localhost:5000/api/vendors?sort=${sortOrder}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        return response.json();
      })
      .then((data) => {
        setVendors(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load list of Vendors');
        setIsLoading(false);
        console.error('Error fetching vendor data:', error);
      });
  }, [sortOrder]); // Add sortOrder as a dependency to refetch on change

  // Function to handle sorting
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Helper function to parse location strings like "1A", "11B" for proper sorting
  const parseLocation = (location) => {
    const match = location.match(/(\d+)([A-Z]?)/i);
    return match ? [parseInt(match[1]), match[2] || ''] : [0, ''];
  };

  // Sort vendors based on the selected order
  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === 'location') {
      const [numA, letterA] = parseLocation(a.location);
      const [numB, letterB] = parseLocation(b.location);
      if (numA === numB) return letterA.localeCompare(letterB);
      return numA - numB;
    } else {
      // "new" and "old" will be sorted by the backend, no need to handle here
      return 0;
    }
  });

  return (
    <div className="vendor-list">
      <Header />
      <div className="sort-options">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Name: Ascending</option>
          <option value="desc">Name: Descending</option>
          <option value="new">New Vendors</option>
          <option value="old">Old Vendors</option>
          <option value="location">Location</option> {/* Added Sort by Location */}
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
                location: vendor.location,
                category: vendor.category,
                avatar: vendor.avatar,
              }}
            />
          ))}
        </div>
      )}

      <div className="vendor-actions">
        <button onClick={openModal}>Add Vendor</button>
        <button onClick={openMap}>View Vendor Map</button>
      </div>
      <AddVendor isOpen={isModalOpen} onClose={closeModal} />
      {isMapOpen && <VendorMap onClose={closeMap} />} {/* Render VendorMap if isMapOpen is true */}
    </div>
  );
};

export default VendorList;
