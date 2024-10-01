import React from 'react';
import './ViewInstagram.css';

const ViewInstagram = ({ post, onClose }) => {
  if (!post) {
    return null;
  }

  const { username, caption, media_url, timestamp } = post;

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

  // Function to separate hashtags from caption
  const separateHashtags = (caption) => {
    const words = caption.split(' ');
    const mainCaption = words.filter(word => !word.startsWith('#')).join(' ');
    const hashtags = words.filter(word => word.startsWith('#')).join(' ');
    return { mainCaption, hashtags };
  };

  const { mainCaption, hashtags } = separateHashtags(caption || '');

  return (
    <div className="view-instagram-modal">
      <div className="view-instagram-content">
        <button className="view-instagram-close-button" onClick={onClose}>X</button>
        <h2 className="view-instagram-username">@{username}</h2>
        
        <div className="view-instagram-media">
          {media_url.endsWith('.mp4') ? (
            <video
              controls
              src={getMediaPath(media_url)}
              className="view-instagram-video"
              onError={(e) => console.error('Error loading video:', e)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={getMediaPath(media_url)}
              alt={caption}
              className="view-instagram-image"
              onError={(e) => console.error('Error loading image:', e)}
            />
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
