import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import VendorMap from '../VendorMap/VendorMap';
import ViewInstagram from '../ViewInstagram/ViewInstagram';
import './ViewVendor.css';

const ViewVendor = ({ vendorId, onClose }) => {
  const [vendor, setVendor] = useState(null);
  const [showVendorMap, setShowVendorMap] = useState(false); // Controls showing the map
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeModal, setActiveModal] = useState('vendor'); // Tracks the active modal (either 'vendor' or 'instagram')
  const modalRef = useRef(null); // Vendor modal reference
  const instagramModalRef = useRef(null); // Instagram modal reference

  // Fetch vendor data by ID
  useEffect(() => {
    if (vendorId) {
      axios.get(`http://localhost:5000/api/vendors/${vendorId}`)
        .then(response => {
          if (response.status === 200) {
            setVendor(response.data); // Vendor data includes Instagram username (if available)
          }
        })
        .catch(error => {
          console.error('Error fetching vendor data:', error);
        });
    }
  }, [vendorId]);

  // Fetch social media posts if Instagram username is available
  useEffect(() => {
    if (vendor && vendor.instagram_username) {
      axios.get(`http://localhost:5000/api/instagram/scraped-posts/${vendor.instagram_username}`)
        .then(response => {
          if (response.status === 200) {
            setSocialMediaPosts(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching social media posts:', error);
        });
    }
  }, [vendor]);

  // Handle closing the modal on outside click or Escape key press
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close only the currently active modal
      if (activeModal === 'instagram' && instagramModalRef.current && !instagramModalRef.current.contains(event.target)) {
        setSelectedPost(null); // Close Instagram modal
        setActiveModal('vendor'); // Return focus to Vendor modal
      } else if (activeModal === 'vendor' && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close Vendor modal
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (activeModal === 'instagram') {
          setSelectedPost(null); // Close Instagram modal
          setActiveModal('vendor'); // Return focus to Vendor modal
        } else if (activeModal === 'vendor') {
          onClose(); // Close Vendor modal
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, selectedPost, activeModal]);

  if (!vendorId) {
    return <div>Error: No vendor ID provided.</div>;
  }

  if (!vendor) {
    console.log('Pulling vendor data...');
    return null;
  }

  const { name, description, category, location, vendorphoto } = vendor;

  // Correct handling for vendor-uploaded banners
  const vendorPhoto = vendorphoto 
    ? `http://localhost:5000${vendorphoto}` // No need to prepend /uploads/vendors/, it's already in the database
    : `${process.env.PUBLIC_URL}/images/placeholders/banner-placeholder-2.png`; // Placeholder for missing vendor photo

  const handlePostClick = (post_id) => {
    axios.get(`http://localhost:5000/api/instagram/scraped-post/${post_id}`)
      .then(response => {
        if (response.status === 200) {
          setSelectedPost(response.data); // Set the specific post as the selected post
          setActiveModal('instagram'); // Set Instagram modal as the active modal
        } else {
          console.error('Post not found:', response);
        }
      })
      .catch(error => {
        console.error('Error fetching specific Instagram post:', error);
      });
  };

  const modalContent = (
    <div className="view-vendor-modal">
      <div className={`view-vendor-content ${selectedPost ? 'blurred' : ''}`} ref={modalRef}>
        <button className="view-vendor-close-button" onClick={onClose}>X</button>
        <h2 className="view-vendor-title">{name}</h2>
        <img
          src={vendorPhoto}
          alt={name}
          className="view-vendor-photo"
          onError={(e) => {
            e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/banner-placeholder.png`;
          }}
        />
        <p className="view-vendor-category">
          Category: {category} |{' '}
          <span className="view-vendor-location-link" onClick={() => setShowVendorMap(true)}>
            Location: {location}
          </span>
        </p>
        <div className="view-vendor-description">
          {description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>

        {socialMediaPosts.length > 0 ? (
          <div className="view-vendor-social-media">
            <h3>- - - === Latest 3 Instagram Posts === - - -</h3>
            <div className="view-vendor-posts-grid">
              {socialMediaPosts.slice(0, 3).map((post, index) => {
                const { video_url, media_url, caption, post_id } = post;
                const thumbnailFile = media_url; // This should be the thumbnail file

                return (
                  <div
                    key={index}
                    className="view-vendor-post-card"
                    onClick={() => handlePostClick(post_id)} // Fetch specific post on click
                  >
                    {thumbnailFile ? (
                      <img
                        src={`http://localhost:5000/downloads/videos/thumbnails/${thumbnailFile}`} // Load thumbnail
                        alt={caption}
                        className="view-vendor-post-image"
                        onError={(e) => {
                          e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/thumbnail-placeholder.png`; // Thumbnail fallback
                        }}
                      />
                    ) : (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/placeholders/post-placeholder.png`} // Fallback image for missing content
                        alt={caption}
                        className="view-vendor-post-image"
                      />
                    )}
                    <p className="view-vendor-post-caption">
                      {caption ? caption.slice(0, 100) + '...' : ''}
                    </p>
                    <p className="view-vendor-post-hashtag">
                      {caption.match(/#[\w]+/) ? caption.match(/#[\w]+/)[0] : ''}
                    </p>
                    <p className="view-vendor-post-timestamp">
                      <span className="view-vendor-click-to-view">Click to view more</span>
                      {' '}
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="view-vendor-social-media">
            <h3>Last 3 Instagram Posts</h3>
            <div className="view-vendor-posts-grid">
              {/* Show 3 placeholders if no posts are available */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="view-vendor-post-card">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/placeholders/post-placeholder.png`}
                    alt="Post Placeholder"
                    className="view-vendor-post-image"
                  />
                  <p className="view-vendor-post-caption">No Social Media Posts</p>
                </div>
              ))}
            </div>
          </div>
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

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay"></div> {/* Black transparent background */}
      {modalContent}
      {selectedPost && (
        <ViewInstagram
          post={selectedPost}
          onClose={() => {
            setSelectedPost(null); // Close Instagram modal
            setActiveModal('vendor'); // Return focus to Vendor modal
          }}
          ref={instagramModalRef} // Attach Instagram modal reference here
        />
      )}
    </>,
    document.body
  );
};

export default ViewVendor;
