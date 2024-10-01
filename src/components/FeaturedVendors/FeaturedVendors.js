import React, { useState, useEffect, useCallback } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import ViewVendor from '../ViewVendor/ViewVendor';
import './FeaturedVendors.css';

// Utility function to shuffle vendors and manage repeats
const getRandomVendors = (vendors, maxCount) => {
  const shuffled = vendors.sort(() => 0.5 - Math.random());
  const result = [];

  // Ensure vendors do not repeat consecutively
  while (result.length < maxCount) {
    for (const vendor of shuffled) {
      if (result.length > 0 && result[result.length - 1].id === vendor.id) continue;
      result.push(vendor);
      if (result.length === maxCount) break;
    }
  }

  return result.slice(0, maxCount);
};

const FeaturedVendors = () => {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/featured')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch featured vendors');
        }
        return response.json();
      })
      .then((data) => {
        const vendors = getRandomVendors(data, 10); // Fetch up to X random vendors
        setFeatured(vendors);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load featured vendors');
        setIsLoading(false);
        console.error('Error fetching featured vendors:', error);
      });
  }, []);

  // Open the modal and pause the scroll animation
  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    const vendorScroll = document.querySelector('.vendor-scroll');
    if (vendorScroll) {
      vendorScroll.style.animationPlayState = 'paused'; // Pause scroll
    }
  };

  // Close the modal and resume the scroll animation
  const closeViewVendorModal = useCallback(() => {
    setSelectedVendor(null);
    const vendorScroll = document.querySelector('.vendor-scroll');
    if (vendorScroll) {
      vendorScroll.style.animationPlayState = 'running'; // Resume scroll
    }
  }, []);

  return (
    <div className="featured-vendors">
      {isLoading ? (
        <div className="loading-message">Loading featured vendors...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="vendor-scroll">
          {featured.map((vendor, index) => (
            <VendorCard 
              key={index} 
              vendor={vendor} 
              onCardClick={() => handleVendorClick(vendor)}
            />
          ))}
        </div>
      )}

      {selectedVendor && (
        <ViewVendor
          vendorId={selectedVendor.id}
          onClose={closeViewVendorModal}
        />
      )}
    </div>
  );
};

export default FeaturedVendors;
