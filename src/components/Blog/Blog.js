import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import AddBlog from '../AddBlog/AddBlog';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);

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

  return (
    <div className="blog-page">
      <Header />
      <div className="blog-content">
        <button className="add-blog-button" onClick={openAddBlogModal}>
          Add Blog
        </button>
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <h2>{blog.title}</h2>
            <p className="blog-date">{new Date(blog.date).toLocaleDateString()}</p>
            {blog.photo_url && <img src={blog.photo_url} alt={blog.title} className="blog-image" />}
            <p className="blog-content">{blog.content}</p>
          </div>
        ))}
      </div>
      {isAddBlogModalOpen && (
        <AddBlog onClose={closeAddBlogModal} onSubmit={handleAddBlog} />
      )}
    </div>
  );
};

export default Blog;
