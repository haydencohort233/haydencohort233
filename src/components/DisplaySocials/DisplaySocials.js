import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InstagramFeed } from 'react-instagram-feed';
import './DisplaySocials.css';

const DisplaySocials = () => {
  const [vendors, setVendors] = useState([]); // All vendors with Instagram
  const [selectedVendors, setSelectedVendors] = useState([]); // Selected vendors to display
  const [vendorPosts, setVendorPosts] = useState([]); // Instagram posts for selected vendors
  const [error, setError] = useState(''); // Error state

  // Fetch all vendors with Instagram on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/vendors-with-instagram')
      .then(response => {
        setVendors(response.data);
      })
      .catch(error => {
        console.error('Error fetching vendors with Instagram:', error);
        setError('Failed to fetch vendors with Instagram.');
      });
  }, []);

  // Fetch posts for selected vendors when the selection changes
  useEffect(() => {
    if (selectedVendors.length > 0) {
      axios.get('http://localhost:5000/api/vendors-instagram-posts', {
        params: {
          selectedVendors: selectedVendors.join(','), // Send selected vendor IDs as a comma-separated string
        },
      })
      .then(response => {
        console.log('Fetched Vendor Posts:', response.data); // Log the fetched posts
        setVendorPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching vendor Instagram posts:', error);
        setError('Failed to fetch vendor Instagram posts.');
      });
    } else {
      setVendorPosts([]); // Clear posts when no vendors are selected
    }
  }, [selectedVendors]);  

  // Toggle vendor selection
  const handleVendorCheck = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  return (
    <div className="display-socials-container">
      <h1>Display Vendor Socials</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error if present */}
      <div className="vendor-checklist">
        <h2>Select Vendors to Display:</h2>
        {vendors.map(vendor => (
          <label key={vendor.id} className="vendor-checkbox">
            <input
              type="checkbox"
              checked={selectedVendors.includes(vendor.id)}
              onChange={() => handleVendorCheck(vendor.id)}
            />
            {vendor.name}
          </label>
        ))}
      </div>
      <div className="socials-display">
        {vendorPosts.length > 0 ? (
          vendorPosts.map(vendor => (
            <div key={vendor.vendor} className="vendor-social">
              <h3>{vendor.vendor}</h3>
              {vendor.posts.length > 0 ? (
                vendor.posts.map(post => (
                  <div key={post.id} className="post">
                    <img src={post.media_url} alt={post.caption} />
                    <p>{post.caption}</p>
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer">View on Instagram</a>
                  </div>
                ))
              ) : (
                <p>No posts available</p>
              )}
            </div>
          ))
        ) : (
          <p>No vendors selected</p>
        )}
      </div>
    </div>
  );
};

export default DisplaySocials;
