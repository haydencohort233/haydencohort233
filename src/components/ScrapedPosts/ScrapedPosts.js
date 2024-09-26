import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import './ScrapedPosts.css';

const ScrapedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(9);
  const [currentIndex, setCurrentIndex] = useState({});
  const [showVideo, setShowVideo] = useState({});
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [filterOption, setFilterOption] = useState('all');

  // Fetch scraped posts on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/scraped-posts')
      .then(response => {
        console.log("Fetched posts:", response.data);
        setPosts(response.data);
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
    setVisiblePosts(visiblePosts + 9); // Show more posts when clicked
  };

  // Sort posts based on the selected option
  const sortPosts = (posts) => {
    return posts.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });
  };

  // Filter posts based on the selected option
  const filterPosts = (posts) => {
    if (filterOption === 'reels') {
      return posts.filter(post => post.video_url); // Show only videos
    } else if (filterOption === 'photos') {
      return posts.filter(post => !post.video_url); // Show only photos
    }
    return posts; // Show all posts
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

  // Handle play button click to show video
  const handlePlayButtonClick = (post_id) => {
    // Revert the currently playing video to thumbnail
    if (currentPlayingVideo !== null && currentPlayingVideo !== post_id) {
      setShowVideo(prevState => ({
        ...prevState,
        [currentPlayingVideo]: false // Revert the previously playing video to its thumbnail
      }));
    }

    // Set the new video as the currently playing video
    setCurrentPlayingVideo(post_id);

    // Show the new video
    setShowVideo(prevState => ({
      ...prevState,
      [post_id]: true // Set the current post video to be visible
    }));
  };

  // Function to get the correct path for the media
  const getMediaPath = (filename) => {
    if (!filename) return '';

    let basePath = '';

    if (filename.endsWith('.mp4')) {
      basePath = '/downloads/videos/';
    } else if (filename.includes('thumbnail')) {
      basePath = '/downloads/videos/thumbnails/';
    } else {
      basePath = '/downloads/photos/';
    }

    const fullPath = `http://localhost:5000${basePath}${filename}`;
    console.log(`Fetching media from: ${fullPath}`);
    return fullPath;
  };

  // Function to separate hashtags from caption
  const separateHashtags = (caption) => {
    const words = caption.split(' ');
    const mainCaption = words.filter(word => !word.startsWith('#')).join(' ');
    const hashtags = words.filter(word => word.startsWith('#')).join(' ');
    return { mainCaption, hashtags };
  };

  // Apply sorting and filtering to posts
  const sortedFilteredPosts = sortPosts(filterPosts(posts));

  return (
    <div className="scraped-posts-container">
      {/* Insert Header Component */}
      <Header /> {/* This is where the Header component is included */}

      <h1 className="scraped-posts-header">Scraped Instagram Posts</h1>

      {/* Error message */}
      {error && <p className="scraped-posts-error-message">{error}</p>}

      {/* Sorting and filtering options */}
      <div className="scraped-posts-controls">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="scraped-posts-select"
        >
          <option value="newest">Newest Posts First</option>
          <option value="oldest">Oldest Posts First</option>
        </select>

        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="scraped-posts-select"
        >
          <option value="all">Show All Media</option>
          <option value="reels">🎥 Reels Only</option>
          <option value="photos">📷 Photos Only</option>
        </select>
      </div>

      {/* Posts Grid */}
      {sortedFilteredPosts.length > 0 ? (
        <div className="scraped-posts-grid">
          {sortedFilteredPosts.slice(0, visiblePosts).map((post, index) => {
            const mediaFiles = post.media_url.split(',');

            if (post.additional_media_urls) {
              mediaFiles.push(...post.additional_media_urls.split(','));
            }

            if (post.video_url) {
              mediaFiles.unshift(post.video_url);
            }

            const currentMedia = mediaFiles[currentIndex[post.post_id]];
            const isCurrentMediaVideo = currentMedia.endsWith('.mp4');
            const { mainCaption, hashtags } = separateHashtags(post.caption);

            return (
              <div key={index} className="scraped-posts-post-card">
                <h3>{post.username}</h3>
                <div className="scraped-posts-carousel-container">
                  {currentIndex[post.post_id] > 0 && (
                    <button className="scraped-posts-carousel-button left" onClick={() => handlePrev(post.post_id)}>
                      &lt;
                    </button>
                  )}

                  {!showVideo[post.post_id] && isCurrentMediaVideo ? (
                    <div className="scraped-posts-thumbnail-container" onClick={() => handlePlayButtonClick(post.post_id)}>
                      <img
                        src={getMediaPath(currentMedia.replace('.mp4', '_thumbnail.jpg'))} // Display the video thumbnail
                        alt={post.caption}
                        className="scraped-posts-post-image"
                        onError={(e) => console.error('Image load error:', e)}
                      />
                      <button className="scraped-posts-play-button-overlay">
                        &#9658; {/* Unicode play button symbol */}
                      </button>
                    </div>
                  ) : (
                    isCurrentMediaVideo ? (
                      <video
                        controls
                        autoPlay
                        src={getMediaPath(currentMedia)} // Load and autoplay the video
                        className="scraped-posts-post-video"
                        onError={(e) => console.error('Video playback error:', e)}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={getMediaPath(currentMedia)}
                        alt={post.caption}
                        className="scraped-posts-post-image"
                        onError={(e) => console.error('Image load error:', e)}
                      />
                    )
                  )}

                  {currentIndex[post.post_id] < mediaFiles.length - 1 && (
                    <button className="scraped-posts-carousel-button right" onClick={() => handleNext(post.post_id)}>
                      &gt;
                    </button>
                  )}
                </div>
                <p className="scraped-posts-caption">
                  {mainCaption.length > 500 ? mainCaption.slice(0, 500) + '...' : mainCaption}
                </p>
                <hr className="scraped-posts-divider" /> {/* Divider below caption */}
                <p className="scraped-posts-hashtags">
                  {hashtags}
                </p>
                <p className="scraped-posts-timestamp">Posted on: {new Date(post.timestamp).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No posts available</p>
      )}

      {/* Load More Button */}
      {visiblePosts < sortedFilteredPosts.length && (
        <button onClick={showMorePosts} className="scraped-posts-load-more-button">Load More</button>
      )}
    </div>
  );
};

export default ScrapedPosts;
