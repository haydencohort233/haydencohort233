import React, { useState } from 'react';
import './VendorCard.css';
import ViewVendor from '../ViewVendor/ViewVendor'; // Ensure correct import path

const VendorCard = ({ vendor }) => {
  const [showModal, setShowModal] = useState(false);

  // Prepend '/uploads/' if the avatar exists
  const avatarUrl = vendor.avatar ? `http://localhost:5000${vendor.avatar}` : '/images/avatar.png';

  // Toggle vendor details modal
  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="vendor-card" onClick={handleCardClick}>
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
