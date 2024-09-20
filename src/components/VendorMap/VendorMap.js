import React, { useEffect, useRef, useState, forwardRef } from 'react';
import './VendorMap.css';

const VendorMap = forwardRef(({ location, onClose }, ref) => {
  const mapRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [hoveredVendor, setHoveredVendor] = useState(null); // Track the hovered vendor

  // Mapping locations to specific coordinates
  const locationCoordinates = {
    // Main Building
    "FRONT": { top: '520px', left: '240px' },
    "1A": { top: '15px', left: '20px' },
    "2A": { top: '75px', left: '20px' },
    "3A": { top: '135px', left: '20px' },
    "4A": { top: '195px', left: '20px' },
    "5A": { top: '255px', left: '20px' },
    "6A": { top: '312px', left: '20px' },
    "7A": { top: '135px', left: '300px' },
    "8A": { top: '195px', left: '300px' },
    "9A": { top: '255px', left: '300px' },
    "10A": { top: '320px', left: '300px' },
    "11A": { top: '380px', left: '300px' },
  };

  // Fetch vendors data from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/vendors')
      .then(response => response.json())
      .then(data => setVendors(data))
      .catch(err => console.error('Error fetching vendors:', err));
  }, []);

  // Highlight location on initial render
  useEffect(() => {
    const highlightLocation = () => {
      if (!mapRef.current) return;

      const selectedSquare = mapRef.current.querySelector(
        `.vendor-location[data-location="${location}"]`
      );

      if (selectedSquare) {
        selectedSquare.classList.add('flashing');
      }

      // Clean up the flashing effect when the component unmounts
      return () => {
        if (selectedSquare) {
          selectedSquare.classList.remove('flashing');
        }
      };
    };

    highlightLocation();
  }, [location]);

  // Handle hover state change
  const handleMouseEnter = (loc) => {
    setHoveredVendor(loc);
  };

  const handleMouseLeave = () => {
    setHoveredVendor(null);
  };

  return (
    <div className="vendor-map-modal" ref={ref}>
      <div className="vendor-map-overlay" onClick={onClose} />
      <div className="vendor-map-content" ref={mapRef}>
        <button className="close-map-button" onClick={onClose}>
          X
        </button>
        <img
          src={process.env.PUBLIC_URL + '/images/vendor-layout.png'}
          alt="Vendor Layout Map"
          className="vendor-map-image"
        />
        {/* Dynamically add squares based on the location mapping */}
        {vendors.map(vendor => {
          const coordinates = locationCoordinates[vendor.location];
          if (!coordinates) return null; // Skip if no coordinates found for location

          return (
            <div
              key={vendor.id}
              className={`vendor-location ${hoveredVendor === vendor.location ? 'hovered' : ''}`}
              data-location={vendor.location}
              style={{ top: coordinates.top, left: coordinates.left }}
              onMouseEnter={() => handleMouseEnter(vendor.location)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Display vendor name above the square */}
              <div className="vendor-name">{vendor.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default VendorMap;
