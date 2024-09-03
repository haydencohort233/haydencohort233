// FeaturedVendors.js
import React, { useState, useEffect, useCallback } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import ViewVendor from '../ViewVendor/ViewVendor'; // Assuming ViewVendor is the modal component
import './FeaturedVendors.css';

// Utility function to shuffle vendors and manage repeats
const getRandomVendors = (vendors, maxCount) => {
  const shuffled = vendors.sort(() => 0.5 - Math.random());
  const result = [];

  // Ensure vendors do not repeat consecutively
  while (result.length < maxCount) {
    for (const vendor of shuffled) {
      // Prevent consecutive duplicates
      if (result.length > 0 && result[result.length - 1].id === vendor.id) continue;
      result.push(vendor);
      if (result.length === maxCount) break;
    }
  }

  while (result.length < maxCount) {
    result.push(...shuffled);
  }

  return result.slice(0, maxCount);
};

const FeaturedVendors = () => {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null); // State to manage modal visibility

  useEffect(() => {
    fetch('http://localhost:5000/api/featured')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch featured vendors');
        }
        return response.json();
      })
      .then((data) => {
        const vendors = getRandomVendors(data, 15); // Fetch up to 15 random vendors
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
    document.querySelector('.vendor-scroll').style.animationPlayState = 'paused';
  };

  // Close the modal and resume the scroll animation
  const closeViewVendorModal = useCallback(() => {
    setSelectedVendor(null);
    document.querySelector('.vendor-scroll').style.animationPlayState = 'running';
  }, []);

  // Window resize event to close modal and resume scroll
  useEffect(() => {
    const handleResize = () => {
      if (selectedVendor) {
        closeViewVendorModal();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener for performance
    };
  }, [selectedVendor, closeViewVendorModal]);

  return (
    <div className="featured-vendors">
      {isLoading ? (
        <div className="loading-message">Loading featured vendors...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="vendor-scroll">
          {featured.map((vendor, index) => (
            <VendorCard key={index} vendor={vendor} onClick={() => handleVendorClick(vendor)} />
          ))}
        </div>
      )}

      {selectedVendor && (
        <ViewVendor
          vendor={selectedVendor}
          onClose={closeViewVendorModal}
        />
      )}
    </div>
  );
};

export default FeaturedVendors;
