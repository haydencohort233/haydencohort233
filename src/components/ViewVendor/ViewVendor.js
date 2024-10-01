import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import VendorMap from '../VendorMap/VendorMap';
import ViewInstagram from '../ViewInstagram/ViewInstagram';
import './ViewVendor.css';

const ViewVendor = ({ vendorId, onClose }) => {
  const [vendor, setVendor] = useState(null);
  const [showVendorMap, setShowVendorMap] = useState(false);
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef(null);

  // Fetch vendor data by ID
  useEffect(() => {
    if (vendorId) {
      axios.get(`http://localhost:5000/api/vendors/${vendorId}`)
        .then(response => {
          if (response.status === 200) {
            setVendor(response.data); // Vendor data includes the Instagram username
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
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && !selectedPost) {
        onClose();
      } else if (event.key === 'Escape' && selectedPost) {
        setSelectedPost(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, selectedPost]);

  if (!vendorId) {
    return <div>Error: No vendor ID provided.</div>;
  }

  if (!vendor) {
    console.log('Pulling vendor data...');
    return null;
  }

  const { name, description, category, location, vendorphoto } = vendor;

  const vendorPhoto = vendorphoto ? `http://localhost:5000${vendorphoto}` : `${process.env.PUBLIC_URL}/images/banner-placeholder.png`;

  const getMediaPath = (filename) => {
    if (!filename) return '';
    if (filename.endsWith('.mp4')) {
      return `http://localhost:5000/downloads/videos/${filename}`;
    } else if (filename.includes('thumbnail')) {
      return `http://localhost:5000/downloads/videos/thumbnails/${filename}`;
    } else {
      return `http://localhost:5000/downloads/photos/${filename}`;
    }
  };

  const getFirstHashtag = (caption) => {
    if (!caption) return '';
    const hashtags = caption.match(/#[\w]+/g);
    return hashtags ? hashtags[0] : '';
  };

  const renderDescriptionWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
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
            e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
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

        {socialMediaPosts.length > 0 ? (
          <div className="view-vendor-social-media">
            <h3>Last 3 Instagram Posts</h3>
            <div className="view-vendor-posts-grid">
              {socialMediaPosts.slice(0, 3).map((post, index) => {
                const mediaFiles = post.media_url.split(',');
                if (post.additional_media_urls) {
                  mediaFiles.push(...post.additional_media_urls.split(','));
                }

                return (
                  <div
                    key={index}
                    className="view-vendor-post-card"
                    onClick={() => handlePostClick(post)}
                  >
                    {mediaFiles.map((filename, mediaIndex) => (
                      <div key={mediaIndex} className="view-vendor-media-container">
                        {filename.endsWith('.mp4') ? (
                          <video
                            controls
                            src={getMediaPath(filename)}
                            className="view-vendor-post-video"
                            onError={(e) => console.error('Error loading video:', e)}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={getMediaPath(filename)}
                            alt={post.caption}
                            className="view-vendor-post-image"
                            onError={(e) => console.error('Error loading image:', e)}
                          />
                        )}
                      </div>
                    ))}
                    <p className="view-vendor-post-caption">
                      {post.caption ? post.caption.slice(0, 100) + '...' : ''}
                    </p>
                    <p className="view-vendor-post-hashtag">
                      {getFirstHashtag(post.caption)}
                    </p>
                    <p className="view-vendor-post-timestamp">
                      <span className="view-vendor-click-to-view">Click to view</span>
                      {' '}
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No social media posts available.</p>
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
      {modalContent}
      {selectedPost && (
        <ViewInstagram
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>,
    document.body
  );
};

export default ViewVendor;
