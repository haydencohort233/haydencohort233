import React from 'react';
import './VendorCard.css';

const VendorCard = ({ vendor }) => {
  // Prepend '/uploads/' if the avatar exists
  const avatarUrl = vendor.avatar ? `http://localhost:5000${vendor.avatar}` : '/images/avatar.png';

  // Debugging logs
  console.log('Vendor Data:', vendor);
  console.log('Avatar URL:', avatarUrl);

  return (
    <div className="vendor-card">
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
        <p className="vendor-description">{vendor.description}</p>
        <small className="vendor-location">
          Category: {vendor.category} | Location: {vendor.location}
        </small>
      </div>
    </div>
  );
};

export default VendorCard;
