import React, { useEffect, useState } from 'react';
import './FeaturedBlogs.css';

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError('Failed to load blogs.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading featured blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="featured-blogs">
      {featuredBlogs.length > 0 ? (
        featuredBlogs.map((blog) => (
          <div key={blog.id} className="featured-blog">
            <h3>{blog.title}</h3>
            <p className="featured-blog-date">{new Date(blog.date).toLocaleDateString()}</p>
            {blog.photo_url && (
              <img src={blog.photo_url} alt={blog.title} className="featured-blog-image" />
            )}
            <p className="featured-blog-preview">
              {blog.preview_text || `${blog.content.substring(0, 150)}...`}
            </p>
            <a href={`/blog/${blog.id}`} className="read-more-link">
              Read more
            </a>
          </div>
        ))
      ) : (
        <p>No featured blogs available.</p>
      )}
    </div>
  );
};

export default FeaturedBlogs;
