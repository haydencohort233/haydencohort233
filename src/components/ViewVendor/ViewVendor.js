import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import VendorMap from '../VendorMap/VendorMap';
import './ViewVendor.css';

const ViewVendor = ({ vendorId, onClose }) => {
  const [vendor, setVendor] = useState(null);
  const [showVendorMap, setShowVendorMap] = useState(false);
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);
  const modalRef = useRef(null);

  console.log("Received Vendor ID:", vendorId); // Debug: Check received vendorId

  // Fetch vendor data by ID
  useEffect(() => {
    if (vendorId) { // Only make the API call if vendorId is valid
      axios.get(`http://localhost:5000/api/vendors/${vendorId}`)
        .then(response => {
          console.log("Fetched Vendor Data from API:", response.data);
          setVendor(response.data);
        })
        .catch(error => {
          console.error('Error fetching vendor data:', error);
        });
    } else {
      console.error('No valid vendorId provided to ViewVendor component.');
    }
  }, [vendorId]);

  // Fetch social media posts if Instagram username is available
  useEffect(() => {
    if (vendor && vendor.instagram_username) {
      console.log(`Fetching posts for: ${vendor.instagram_username}`);
      axios.get(`http://localhost:5000/api/scraped-posts/${vendor.instagram_username}`)
        .then(response => {
          console.log("Fetched Social Media Posts:", response.data);
          setSocialMediaPosts(response.data);
        })
        .catch(error => {
          console.error('Error fetching social media posts:', error);
        });
    }
  }, [vendor]); // This useEffect depends on the vendor state being updated

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

  if (!vendorId) {
    return <div>Error: No vendor ID provided.</div>;
  }

  if (!vendor) {
    return <div>Loading...</div>;
  }

  const { name, description, category, location, vendorphoto, instagram_username } = vendor;

  console.log("Vendor ID:", vendorId); // Log vendor ID to see which vendor is being displayed
  console.log("Fetched Vendor Data:", vendor); // Log complete vendor object
  console.log("Instagram Username:", instagram_username); // Log specific instagram_username

  const vendorPhoto = vendorphoto ? `http://localhost:5000${vendorphoto}` : `${process.env.PUBLIC_URL}/images/placeholder.png`;

  const renderDescriptionWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const modalContent = (
    <div className="view-vendor-modal">
      <div className="view-vendor-content" ref={modalRef}>
        <button className="view-vendor-close-button" onClick={onClose}>X</button>
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

        {/* Display Instagram Username */}
        {instagram_username ? (
          <div className="view-vendor-social">
            <p className="view-vendor-instagram">Instagram: @{instagram_username}</p>
          </div>
        ) : (
          <p>No Instagram username provided.</p>
        )}

        {/* Social Media Posts Section */}
        {socialMediaPosts.length > 0 ? (
          <div className="view-vendor-social-media">
            <h3>Latest Social Media Posts</h3>
            <div className="view-vendor-posts-grid">
              {socialMediaPosts.map((post, index) => (
                <div key={index} className="view-vendor-post-card">
                  {post.media_url && (
                    <img
                      src={`http://localhost:5000/downloads/photos/${post.media_url.split(',')[0]}`} // Display the first image
                      alt={post.caption}
                      className="view-vendor-post-image"
                      onError={(e) => console.error('Error loading image:', e)}
                    />
                  )}
                  <p className="view-vendor-post-caption">
                    {post.caption ? post.caption.slice(0, 100) + '...' : ''}
                  </p>
                  <p className="view-vendor-post-timestamp">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No social media posts available.</p> // Show this if no posts are found
        )}
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
