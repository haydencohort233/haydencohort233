// ViewVendor.js
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import VendorMap from '../VendorMap/VendorMap'; // Import the VendorMap component
import './ViewVendor.css';

const ViewVendor = ({ vendor, onClose }) => {
  const { name, description, category, location, avatar } = vendor;
  const avatarUrl = avatar ? `http://localhost:5000${avatar}` : '/images/avatar.png';

  const modalRef = useRef(null);
  const [showVendorMap, setShowVendorMap] = useState(false); // State to manage VendorMap visibility

  // Function to render description with line breaks
  const renderDescriptionWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Close modal on clicking outside of it or pressing the Escape key
  useEffect(() => {
    // Pause the animation of .vendor-scroll if it exists
    const vendorScrollElement = document.querySelector('.vendor-scroll');
    if (vendorScrollElement) {
      vendorScrollElement.style.animationPlayState = 'paused';
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      // Resume the animation of .vendor-scroll if it exists
      if (vendorScrollElement) {
        vendorScrollElement.style.animationPlayState = 'running';
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const modalContent = (
    <div className="view-vendor-modal">
      <div className="view-vendor-content" ref={modalRef}>
        <button className="close-vendor-button" onClick={onClose}>
          X
        </button>
        <h2>{name}</h2>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            className="view-vendor-avatar"
          />
        )}
        <p className="vendor-category">
          Category: {category} |{' '}
          <span
            className="location-link"
            onClick={() => setShowVendorMap(true)} // Open the VendorMap
          >
            Location: {location}
          </span>
        </p>
        <div className="vendor-description">
          {renderDescriptionWithLineBreaks(description)}
        </div>
      </div>

      {/* Conditionally render VendorMap, keeping ViewVendor underneath */}
      {showVendorMap && (
        <VendorMap
          location={location}
          onClose={() => setShowVendorMap(false)} // Close VendorMap and return to ViewVendor
        />
      )}
    </div>
  );

  // Render modal content inside a portal to detach it from the parent component's layout constraints
  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewVendor;
