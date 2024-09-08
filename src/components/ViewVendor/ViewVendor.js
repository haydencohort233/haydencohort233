// ViewVendor.js
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import VendorMap from '../VendorMap/VendorMap'; // Import the VendorMap component
import './ViewVendor.css';

const ViewVendor = ({ vendor, onClose }) => {
  const { name, description, category, location, vendorphoto } = vendor;
  const vendorPhoto = vendorphoto ? `http://localhost:5000${vendorphoto}` : '/images/avatar.png';

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

  useEffect(() => {
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
          <img
          src={vendor.vendorphoto ? `http://localhost:5000${vendor.vendorphoto}` : '/images/placeholder.png'}
            alt={vendor.name}
            className="view-vendorphoto"
          />
        <p className="vendor-category">
          Category: {category} |{' '}
          <span className="location-link" onClick={() => setShowVendorMap(true)}>
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
