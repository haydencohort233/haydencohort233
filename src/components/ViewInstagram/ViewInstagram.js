import React, { useRef, useEffect, useState, forwardRef } from 'react';
import './ViewInstagram.css';

const ViewInstagram = forwardRef(({ post, onClose }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const internalRef = useRef(null);
  const instagramModalRef = ref || internalRef;

  if (!post) {
    console.log('No post data available.');
    return null;
  }

  const { username, caption, media_url, timestamp, additional_media_urls = '', video_url } = post;

  // Handle the case where there's a video (only one thumbnail)
  const hasVideo = video_url && video_url.endsWith('.mp4');

  // Split media files (images) for the carousel
  const mediaFiles = hasVideo
    ? [media_url]  // Only one thumbnail for video
    : [...media_url.split(','), ...additional_media_urls.split(',').filter(Boolean)]; // Multiple photos

  const getMediaPath = (filename) => {
    if (!filename) return '';
    if (hasVideo) {
      console.log(`Loading video: ${video_url}`);
      return `http://localhost:5000/downloads/videos/${video_url}`;  // Video URL
    } else if (filename.includes('thumbnail')) {
      console.log(`Loading thumbnail: ${filename}`);
      return `http://localhost:5000/downloads/videos/thumbnails/${filename}`;  // Load video thumbnail
    } else {
      console.log(`Loading image: ${filename}`);
      return `http://localhost:5000/downloads/photos/${filename}`;  // Photo URL for images
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
    console.log(`Next media index: ${currentIndex}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaFiles.length) % mediaFiles.length);
    console.log(`Previous media index: ${currentIndex}`);
  };

  const currentMedia = mediaFiles[currentIndex].trim(); // Handle spaces and clean the filename
  console.log(`Current media file: ${currentMedia}`);

  return (
    <div className="view-instagram-modal">
      <div className="view-instagram-content" ref={instagramModalRef}>
        <button className="view-instagram-close-button" onClick={onClose}>X</button>
        <h2 className="view-instagram-username">@{username}</h2>

        <div className="view-instagram-media">
          {hasVideo ? (
            <video
              controls
              src={getMediaPath(video_url)} // Load video path here
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

        {!hasVideo && mediaFiles.length > 1 && (
          <div className="view-instagram-carousel-controls">
            <button onClick={handlePrev} className="view-instagram-carousel-button left">&lt;</button>
            <button onClick={handleNext} className="view-instagram-carousel-button right">&gt;</button>
          </div>
        )}

        <p className="view-instagram-caption">{caption}</p>
        <p className="view-instagram-timestamp">
          {new Date(timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
});

export default ViewInstagram;
