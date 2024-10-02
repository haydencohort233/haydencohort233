import React, { useEffect, useRef, useState, forwardRef } from 'react';
import './VendorMap.css';
import vendorCoordinates from './vendorCoordinates.json';

const VendorMap = forwardRef(({ location, onClose, onVendorClick }, ref) => {
  const mapRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const getCoordinates = () => {
    return isMobile ? vendorCoordinates.smallMapCoordinates : vendorCoordinates.largeMapCoordinates;
  };

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Initial check

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/vendors')
      .then((response) => response.json())
      .then((data) => {
        setVendors(data);
        setFilteredVendors(data); // Initially show all vendors
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching vendors:', err);
        setLoading(false);
      });
  }, []);

  const getVendorByLocation = (location) => {
    return vendors.find((vendor) => vendor.location === location);
  };

  const handleMouseEnter = (loc) => {
    setHoveredVendor(loc);
  };

  const handleMouseLeave = (loc) => {
    setHoveredVendor(null);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const filtered = vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredVendors(filtered);
  };

  // Ensure onVendorClick is defined before calling it
  const handleVendorClick = (vendorId) => {
    if (typeof onVendorClick === 'function') {
      onVendorClick(vendorId);
    } else {
      console.error('onVendorClick is not a function');
    }
  };

  const coordinates = getCoordinates();

  return (
    <div className="vendor-map-modal" ref={ref}>
      <div className="vendor-map-overlay" onClick={onClose} />
      <div className="vendor-map-content" ref={mapRef}>
        <button className="close-map-button" onClick={onClose}>
          X
        </button>
        {loading ? (
          <img
            src={process.env.PUBLIC_URL + '/images/icons/loading.gif'}
            alt="Loading"
            className="vendor-map-loading"
          />
        ) : (
          <>
            <input
              type="text"
              className="vendor-search-input"
              placeholder="Search Vendor"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img
              src={process.env.PUBLIC_URL + '/images/vendor-layout.png'}
              alt="Vendor Layout Map"
              className="vendor-map-image"
            />
            {Object.keys(coordinates).map((locationKey) => {
              const vendor = getVendorByLocation(locationKey);
              const coords = coordinates[locationKey];
              
              // Determine if vendor should flash
              const isFlashing = vendor && (!location || location === locationKey);

              return (
                <div
                  key={locationKey}
                  className={`vendor-location ${vendor ? (hoveredVendor === locationKey ? 'hovered' : '') : 'empty-location'} ${isFlashing ? 'flashing' : ''}`}  
                  data-location={locationKey}
                  style={{ 
                    top: coords.top, 
                    left: coords.left, 
                    width: coords.width || '90px',
                    height: coords.height || '50px'
                  }}
                  onMouseEnter={() => handleMouseEnter(locationKey)}
                  onMouseLeave={() => handleMouseLeave(locationKey)}
                  onClick={() => vendor && handleVendorClick(vendor.id)} // Only clickable if a vendor exists
                >
                  {vendor ? (
                    <div className="vendor-name">{vendor.name}</div>
                  ) : (
                    <div className="vendor-name">Available Slot</div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
});

export default VendorMap;
