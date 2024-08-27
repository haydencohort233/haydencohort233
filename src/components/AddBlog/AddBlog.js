import React, { useState } from 'react';
import './AddBlog.css';

const AddBlog = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('date', date);
      formData.append('preview_text', previewText);
      formData.append('photo', photo);

      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong!');
      }

      // Ensure the onSubmit callback is called before closing
      onSubmit(data);

      // Close the modal after successful submission
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-blog-modal">
        <h2>Add New Blog</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <label>Preview Text:</label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            maxLength="255"
            required
          />

          <label>Photo:</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <div className="modal-buttons">
            <button type="submit" disabled={isSubmitting}>Add Blog</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
