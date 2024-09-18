import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import './AddBlog.css';

const AddBlog = ({ isOpen, onClose, onSubmit }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [photo, setPhoto] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Sanitize the content before saving it to the database
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', sanitizedContent);  // Append the sanitized content
      formData.append('date', date);
      formData.append('preview_text', previewText);
      if (photo) {
        formData.append('photo', photo);
      }

      const adminUsername = Cookies.get('adminUsername');

      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Admin-Username': adminUsername,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong!');
      }

      onSubmit(data); // Call onSubmit function when successful
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-blog-modal-overlay">
      <div className="add-blog-modal-content">
        <h2 className="add-blog-title">
          Add New Blog
          <span className="add-blog-close-button" onClick={onClose}>×</span>
        </h2>
        {error && <p className="add-blog-error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="add-blog-form">
          <label className="add-blog-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="add-blog-input"
            placeholder="Blog Title"
          />

          <label className="add-blog-label">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="add-blog-input"
          />

          <label className="add-blog-label">Preview Text:</label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            maxLength="255"
            required
            className="add-blog-input"
             placeholder="Blog Preview Text"
          />

          <label className="add-blog-label">Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            placeholder="Write your blog content here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            className="add-blog-editor"
          />

          <label className="add-blog-label">Photo:</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="add-blog-input"
          />
          <p className="add-blog-file-info">
            File size limit: 2MB. Accepted formats: .jpg, .jpeg, .png
          </p>

          <div className="add-blog-buttons">
            <button type="button" className="add-blog-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-blog-save-button" disabled={isSubmitting}>
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
