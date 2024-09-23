import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScrapedPosts.css';

const ScrapedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(9);
  const [currentIndex, setCurrentIndex] = useState({});

  // Fetch scraped posts on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/scraped-posts')
      .then(response => {
        console.log("Fetched posts:", response.data); // Debug: Log fetched posts
        setPosts(response.data); // Store the fetched posts in the state
        // Initialize current index state for each post
        const initialIndexes = response.data.reduce((acc, post) => {
          acc[post.post_id] = 0; // Each post starts with the first image or video
          return acc;
        }, {});
        setCurrentIndex(initialIndexes);
      })
      .catch(error => {
        console.error('Error fetching scraped posts:', error);
        setError('Failed to fetch scraped posts.');
      });
  }, []);

  const showMorePosts = () => {
    setVisiblePosts(visiblePosts + 9); // Show 9 more posts when clicked
  };

// Function to get the correct path for the media
const getMediaPath = (filename) => {
  if (!filename) return ''; // Return empty string if no filename is provided

  // Check the filename to determine the correct base path
  let basePath = '';

  if (filename.endsWith('.mp4')) {
    basePath = '/downloads/videos/';
  } else if (filename.includes('thumbnail')) {
    basePath = '/downloads/videos/thumbnails/';
  } else {
    basePath = '/downloads/photos/';
  }

  const fullPath = `http://localhost:5000${basePath}${filename}`;
  console.log(`Fetching media from: ${fullPath}`); // Debug: Log media path
  return fullPath;
};

  // Function to separate hashtags from caption
  const separateHashtags = (caption) => {
    const words = caption.split(' ');
    const mainCaption = words.filter(word => !word.startsWith('#')).join(' ');
    const hashtags = words.filter(word => word.startsWith('#')).join(' ');
    return { mainCaption, hashtags };
  };

  // Handle next image in carousel
  const handleNext = (post_id) => {
    setCurrentIndex(prevState => ({
      ...prevState,
      [post_id]: prevState[post_id] + 1
    }));
  };

  // Handle previous image in carousel
  const handlePrev = (post_id) => {
    setCurrentIndex(prevState => ({
      ...prevState,
      [post_id]: prevState[post_id] - 1
    }));
  };

  return (
    <div className="scraped-posts-container">
      <h1>Scraped Instagram Posts</h1>
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.slice(0, visiblePosts).map((post, index) => {
            const mediaFiles = post.media_url.split(','); // Split media URLs into an array

            // Add any additional media files, if available
            if (post.additional_media_urls) {
              mediaFiles.push(...post.additional_media_urls.split(','));
            }

            // Include video URL if available
            if (post.video_url) {
              mediaFiles.unshift(post.video_url);
            }

            // Current media to display
            const currentMedia = mediaFiles[currentIndex[post.post_id]];

            // Determine if the current media is a video or an image
            const isCurrentMediaVideo = currentMedia.endsWith('.mp4');

            // Separate caption and hashtags
            const { mainCaption, hashtags } = separateHashtags(post.caption);

            return (
              <div key={index} className="post-card">
                <h3>{post.username}</h3>
                <div className="carousel-container">
                  {currentIndex[post.post_id] > 0 && (
                    <button className="carousel-button left" onClick={() => handlePrev(post.post_id)}>
                      &lt;
                    </button>
                  )}

                  {isCurrentMediaVideo ? (
                    <video
                      controls
                      src={getMediaPath(currentMedia, true)} // Video path
                      className="post-video"
                      onError={(e) => console.error('Video playback error:', e)} // Debug: Log video playback errors
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={getMediaPath(currentMedia)} // Display the image or video thumbnail
                      alt={post.caption}
                      className="post-image"
                      onError={(e) => console.error('Image load error:', e)} // Debug: Log image loading errors
                    />
                  )}

                  {currentIndex[post.post_id] < mediaFiles.length - 1 && (
                    <button className="carousel-button right" onClick={() => handleNext(post.post_id)}>
                      &gt;
                    </button>
                  )}
                </div>
                <p className="caption">
                  {mainCaption.length > 200 ? mainCaption.slice(0, 200) + '...' : mainCaption}
                </p>
                <p className="hashtags">
                  {hashtags}
                </p>
                <p className="timestamp">Posted on: {new Date(post.timestamp).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No posts available</p>
      )}
      {visiblePosts < posts.length && (
        <button onClick={showMorePosts} className="load-more-button">Load More</button>
      )}
    </div>
  );
};

export default ScrapedPosts;
