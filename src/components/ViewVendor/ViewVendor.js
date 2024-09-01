import React, { useEffect, useRef } from 'react';
import './ViewVendor.css';

const ViewVendor = ({ vendor, onClose }) => {
  const { name, description, category, location, avatar } = vendor;
  const avatarUrl = avatar ? `http://localhost:5000${avatar}` : '/images/avatar.png';

  const modalRef = useRef(null);

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
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="view-vendor-modal">
      <div className="view-vendor-content" ref={modalRef}>
        <button className="close-modal-button" onClick={onClose}>
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
          Category: {category} | Location: {location}
        </p>
        <div className="vendor-description">
          {renderDescriptionWithLineBreaks(description)}
        </div>
      </div>
    </div>
  );
};

export default ViewVendor;
