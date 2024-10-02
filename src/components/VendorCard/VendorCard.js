import React, { useState } from 'react';
import './VendorCard.css';
import ViewVendor from '../ViewVendor/ViewVendor';

const VendorCard = ({ vendor, onCardClick }) => { // Add onCardClick prop
  const [showModal, setShowModal] = useState(false);

  const avatarUrl = vendor.avatar ? `http://localhost:5000${vendor.avatar}` : '/images/avatar.png';

  const handleCardClick = () => {
    if (vendor.id) { // Ensure that vendor has an id before opening the modal
      onCardClick(vendor.id); // Call the onCardClick prop with vendor id
      setShowModal(true);
    } else {
      console.error('Vendor ID is missing. Cannot open the modal.');
    }
  };

  const isNewVendor = () => {
    const today = new Date();
    let createdDate;

    if (vendor.datecreated) {
      createdDate = new Date(vendor.datecreated);
      if (isNaN(createdDate.getTime())) {
        createdDate = new Date(vendor.datecreated.replace(/-/g, '/'));
      }
    }

    if (!createdDate || isNaN(createdDate.getTime())) {
      console.error('Invalid Date format:', vendor.datecreated);
      return false;
    }

    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 100;
  };

  return (
    <>
      <div className="vendor-card" onClick={handleCardClick}> {/* Call handleCardClick on click */}
        {isNewVendor() && (
          <div className="new-badge">NEW VENDOR</div>
        )}
        <img
          src={avatarUrl}
          alt={`${vendor.name} avatar`}
          className="vendor-card-avatar"
          onError={(e) => {
            console.error('Failed to load avatar:', e.target.src);
            e.target.src = '/images/avatar.png';
          }}
        />
        <div className="vendor-card-info">
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
      {showModal && (
        <ViewVendor
          vendorId={vendor.id} // Pass vendor.id here
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default VendorCard;
