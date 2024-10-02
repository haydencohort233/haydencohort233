import React, { useState } from 'react';
import './ViewInstagram.css';

const ViewInstagram = ({ post, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!post) {
    return null;
  }

  const { username, caption, media_url, timestamp, additional_media_urls = '' } = post;

  const mediaFiles = [media_url, ...additional_media_urls.split(',')];

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

  const separateHashtags = (caption) => {
    const words = caption.split(' ');
    const mainCaption = words.filter(word => !word.startsWith('#')).join(' ');
    const hashtags = words.filter(word => word.startsWith('#')).join(' ');
    return { mainCaption, hashtags };
  };

  const { mainCaption, hashtags } = separateHashtags(caption || '');

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaFiles.length) % mediaFiles.length);
  };

  const currentMedia = mediaFiles[currentIndex];

  return (
    <div className="view-instagram-modal">
      <div className="view-instagram-content">
        <button className="view-instagram-close-button" onClick={onClose}>X</button>
        <h2 className="view-instagram-username">@{username}</h2>

        <div className="view-instagram-media">
          {currentMedia.endsWith('.mp4') ? (
            <video
              controls
              src={getMediaPath(currentMedia)}
              className="view-instagram-video"
              onError={(e) => console.error('Error loading video:', e)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={getMediaPath(currentMedia)}
              alt={caption}
              className="view-instagram-image"
              onError={(e) => {
                e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/thumbnail-placeholder.png`;
              }}
            />
          )}
        </div>

        <div className="view-instagram-carousel-controls">
          {mediaFiles.length > 1 && (
            <>
              <button onClick={handlePrev} className="view-instagram-carousel-button left">&lt;</button>
              <button onClick={handleNext} className="view-instagram-carousel-button right">&gt;</button>
            </>
          )}
        </div>

        <p className="view-instagram-caption">{mainCaption}</p>
        <p className="view-instagram-hashtags">{hashtags}</p>
        <p className="view-instagram-timestamp">
          {new Date(timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ViewInstagram;
