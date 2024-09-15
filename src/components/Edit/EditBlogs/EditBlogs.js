import React, { useState, useEffect } from 'react';
import './EditBlogs.css';

const EditBlogs = React.forwardRef(({ isOpen, onClose }, ref) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    date: '',
    preview_text: '',
    photo: null,
  });
  const [error, setError] = useState('');

  // Fetch all blogs when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/blogs')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setBlogs(data);
        })
        .catch(err => {
          console.error('Error fetching blogs:', err.message);
          setError('Failed to load blogs. Please try again.');
        });
    }
  }, [isOpen]);

  // Fetch selected blog data when a blog is selected
  useEffect(() => {
    if (selectedBlogId) {
      fetch(`http://localhost:5000/api/blogs/${selectedBlogId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setBlogData({
            title: data.title,
            content: data.content,
            date: data.date.split('T')[0], // Format date for input
            preview_text: data.preview_text,
            photo: null, // Reset photo
          });
        })
        .catch(err => {
          console.error('Error fetching blog data:', err);
          setError('Failed to load blog data. Please try again.');
        });
    }
  }, [selectedBlogId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setBlogData({ ...blogData, photo: e.target.files[0] });
  };

  // Handle form submission to update the blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlogId) return;

    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('date', blogData.date);
    formData.append('preview_text', blogData.preview_text);
    if (blogData.photo) {
      formData.append('photo', blogData.photo);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${selectedBlogId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        onClose(); // Close modal after successful update
      } else {
        const errorData = await response.json();
        console.error('Error updating blog:', errorData);
        setError('Failed to update blog. Please try again.');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={ref} className="edit-blog-modal-overlay">
      <div className="edit-blog-modal-content">
        <h2 className="edit-blog-title">
          Edit Blog
          <span className="edit-blog-close-modal" onClick={onClose}>×</span>
        </h2>
        {error && <p className="edit-blog-error-message">{error}</p>}

        {!selectedBlogId ? (
          <div className="edit-blog-list">
            <h3>Select a Blog</h3>
            <ul>
              {blogs.map(blog => (
                <li key={blog.id} onClick={() => setSelectedBlogId(blog.id)}>
                  {blog.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form className="edit-blog-form" onSubmit={handleSubmit}>
            <label className="edit-blog-label">
              Title:
              <input
                type="text"
                name="title"
                className="edit-blog-input"
                value={blogData.title || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-blog-label">
              Content:
              <textarea
                name="content"
                className="edit-blog-textarea"
                value={blogData.content || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-blog-label">
              Date:
              <input
                type="date"
                name="date"
                className="edit-blog-input"
                value={blogData.date || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-blog-label">
              Preview Text:
              <input
                type="text"
                name="preview_text"
                className="edit-blog-input"
                value={blogData.preview_text || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-blog-label">
              Photo:
              <input
                type="file"
                name="photo"
                className="edit-blog-file-input"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </label>
            <div className="edit-blog-buttons">
              <div className="edit-blog-buttons-left">
                <button
                  type="button"
                  className="edit-blog-back-button"
                  onClick={() => setSelectedBlogId(null)}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="edit-blog-cancel-button"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <button type="submit" className="edit-blog-save-button">Update Blog</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

export default EditBlogs;
