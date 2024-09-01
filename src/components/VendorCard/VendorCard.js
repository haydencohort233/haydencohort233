import React, { useState } from 'react';
import './VendorCard.css';
import ViewVendor from '../ViewVendor/ViewVendor'; // Ensure correct import path

const VendorCard = ({ vendor }) => {
  const [showModal, setShowModal] = useState(false);

  // Prepend '/uploads/' if the avatar exists
  const avatarUrl = vendor.avatar ? `http://localhost:5000${vendor.avatar}` : '/images/avatar.png';

  return (
    <>
      <div className="vendor-card" onClick={() => setShowModal(true)}>
        <img
          src={avatarUrl}
          alt={`${vendor.name} avatar`}
          className="vendor-avatar"
          onError={(e) => {
            console.error('Failed to load avatar:', e.target.src);
            e.target.src = '/images/avatar.png'; // Fallback to default image if custom avatar fails to load
          }}
        />
        <div className="vendor-info">
          <h2 className="vendor-name">{vendor.name}</h2>
          <p className="vendor-description">
            {vendor.description.length > 100
              ? `${vendor.description.substring(0, 97)}...`
              : vendor.description}
          </p>
          <small className="vendor-location">
            Category: {vendor.category} | Location: {vendor.location}
          </small>
        </div>
      </div>
      {showModal && <ViewVendor vendor={vendor} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default VendorCard;
