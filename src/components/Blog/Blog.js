import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import ViewBlog from '../ViewBlog/ViewBlog';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleAddBlog = (newBlog) => {
    if (!newBlog.id) {
      newBlog.id = Date.now(); // Temporary unique ID if the backend doesn't return one
    }
    setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
  };  

  const openAddBlogModal = () => {
    setIsAddBlogModalOpen(true);
  };

  const closeAddBlogModal = () => {
    setIsAddBlogModalOpen(false);
  };

  const openViewBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeViewBlogModal = () => {
    setSelectedBlog(null);
  };

    // Function to render content with line breaks
    const renderContentWithLineBreaks = (content) => {
        return content.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
      };

  return (
    <div className="blog-page">
      <Header />
      <div className="blog-content">
        <button className="add-blog-button" onClick={openAddBlogModal}>
          Add Blog
        </button>
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-post" onClick={() => openViewBlogModal(blog)}>
            <h2>{blog.title}</h2>
            <p className="blog-date">{new Date(blog.date).toLocaleDateString()}</p>
            {blog.photo_url && <img src={`http://localhost:5000${blog.photo_url}`} alt={blog.title} className="blog-image" />}
            <p className="blog-content">{blog.preview_text || `${blog.content.substring(0, 150)}...`}</p>
            <p className="read-more-link">Click to read more</p>
          </div>
        ))}
      </div>
      {selectedBlog && (
        <ViewBlog blog={selectedBlog} onClose={closeViewBlogModal} />
      )}
    </div>
  );
};

export default Blog;
