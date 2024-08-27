import React, { useState, useEffect } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import './FeaturedVendors.css';

const FeaturedVendors = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/featured')
      .then(response => response.json())
      .then(data => setFeatured(data))
      .catch(error => console.error('Error fetching featured vendors:', error));
  }, []);

  return (
    <div className="featured-vendors">
      <h2>Featured Vendors</h2>
      <div className="vendor-scroll">
        {featured.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedVendors;
