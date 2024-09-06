import React, { useState } from 'react';
import './VendorCard.css';
import ViewVendor from '../ViewVendor/ViewVendor';

const VendorCard = ({ vendor }) => {
  const [showModal, setShowModal] = useState(false);

  const avatarUrl = vendor.avatar ? `http://localhost:5000${vendor.avatar}` : '/images/avatar.png';

  const handleCardClick = () => {
    setShowModal(true);
  };

  // Function to check if the vendor is new (within 100 days)
  const isNewVendor = () => {
    const today = new Date();
    let createdDate;

    // Check if the datecreated value is available and not undefined
    if (vendor.datecreated) {
      // Attempt to create a Date object directly from the string
      createdDate = new Date(vendor.datecreated);

      // If direct parsing fails try slashes
      if (isNaN(createdDate.getTime())) {
        // Try parsing by replacing hyphens with slashes
        createdDate = new Date(vendor.datecreated.replace(/-/g, '/'));
      }
    }

    // Final check if the date is still invalid
    if (!createdDate || isNaN(createdDate.getTime())) {
      console.error('Invalid Date format:', vendor.datecreated);
      return false;
    }

    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 100; // Check if within 100 days
  };

  return (
    <>
      <div className="vendor-card" onClick={handleCardClick}>
        {/* NEW badge */}
        {isNewVendor() && (
          <div className="new-badge">
            NEW
          </div>
        )}
        <img
          src={avatarUrl}
          alt={`${vendor.name} avatar`}
          className="vendor-avatar"
          onError={(e) => {
            console.error('Failed to load avatar:', e.target.src);
            e.target.src = '/images/avatar.png'; // Fallback to default image if avatar fails to load
          }}
        />
        <div className="vendor-info">
          <h2 className="vendor-card-name">{vendor.name}</h2>
          <p className="vendor-card-description">
            {vendor.description.length > 150
              ? `${vendor.description.substring(0, 147)}...`
              : vendor.description}
          </p>
          <small className="vendor-card-location">
            Category: {vendor.category || 'N/A'} | Location: {vendor.location || 'N/A'}
          </small>
        </div>
      </div>
      {showModal && <ViewVendor vendor={vendor} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default VendorCard;
