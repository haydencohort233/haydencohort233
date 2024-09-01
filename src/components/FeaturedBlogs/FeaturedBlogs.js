// FeaturedBlogs.js
import React, { useEffect, useState } from 'react';
import './FeaturedBlogs.css';
import ViewBlog from '../ViewBlog/ViewBlog';

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/blogs?limit=2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFeaturedBlogs(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured blogs:', error);
        setError('Failed to load blogs');
        setIsLoading(false);
      });
  }, []);

  const openViewBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeViewBlogModal = () => {
    setSelectedBlog(null);
  };

  if (isLoading) return <p className="loading-message">Loading featured blogs...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="featured-blogs">
      {featuredBlogs.length > 0 ? (
        featuredBlogs.map((blog) => (
          <div key={blog.id} className="featured-blog" onClick={() => openViewBlogModal(blog)}>
            <h3>{blog.title}</h3>
            <p className="featured-blog-date">{new Date(blog.date).toLocaleDateString()}</p>
            {blog.photo_url && (
              <img src={`http://localhost:5000${blog.photo_url}`} alt={blog.title} className="featured-blog-image" />
            )}
            <p className="featured-blog-preview">
              {blog.preview_text || `${blog.content.substring(0, 150)}...`}
            </p>
          </div>
        ))
      ) : (
        <p>No featured blogs available.</p>
      )}

      {selectedBlog && (
        <ViewBlog blog={selectedBlog} onClose={closeViewBlogModal} />
      )}
    </div>
  );
};

export default FeaturedBlogs;
