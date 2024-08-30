// FeaturedVendors.js
import React, { useState, useEffect } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import './FeaturedVendors.css';

const FeaturedVendors = () => {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/featured')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch featured vendors');
        }
        return response.json();
      })
      .then((data) => {
        setFeatured([...data, ...data]); // Duplicate the data for smooth looping
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load featured vendors');
        setIsLoading(false);
        console.error('Error fetching featured vendors:', error);
      });
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
            <VendorCard key={index} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVendors;
