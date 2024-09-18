import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import VendorMap from '../VendorMap/VendorMap';
import './ViewVendor.css';

const ViewVendor = ({ vendor, onClose }) => {
  const { name, description, category, location, vendorphoto } = vendor;
  
  // Use process.env.PUBLIC_URL for assets in public folder
  const vendorPhoto = vendorphoto ? `http://localhost:5000${vendorphoto}` : `${process.env.PUBLIC_URL}/images/placeholder.png`;

  const modalRef = useRef(null);
  const [showVendorMap, setShowVendorMap] = useState(false);

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
        <button className="view-vendor-close-button" onClick={onClose}>
          X
        </button>
        <h2 className="view-vendor-title">{name}</h2>
        <img
          src={vendorPhoto}
          alt={name}
          className="view-vendor-photo"
          onError={(e) => {
            e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.png`; // Fallback to placeholder image
          }}
        />
        <p className="view-vendor-category">
          Category: {category} |{' '}
          <span className="view-vendor-location-link" onClick={() => setShowVendorMap(true)}>
            Location: {location}
          </span>
        </p>
        <div className="view-vendor-description">
          {renderDescriptionWithLineBreaks(description)}
        </div>
      </div>

      {showVendorMap && (
        <VendorMap
          location={location}
          onClose={() => setShowVendorMap(false)}
        />
      )}
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewVendor;
