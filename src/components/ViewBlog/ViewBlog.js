import React from 'react';
import './ViewBlog.css';

const ViewBlog = ({ blog, onClose }) => {
  const { title, content, date, modified_date, photo_url } = blog;
  const formattedDate = new Date(date).toLocaleDateString();
  const formattedModifiedDate = modified_date ? new Date(modified_date).toLocaleDateString() : null;

  return (
    <div className="view-blog-modal">
      <div className="view-blog-content">
        <button className="close-modal-button" onClick={onClose}>
          X
        </button>
        <h2>{title}</h2>
        <p className="view-blog-date">Posted: {formattedDate}</p>
        {formattedModifiedDate && formattedModifiedDate !== formattedDate && (
          <p className="view-blog-modified-date">Modified: {formattedModifiedDate}</p>
        )}
        {photo_url && <img src={`http://localhost:5000${photo_url}`} alt={title} className="view-blog-image" />}
        <p className="view-blog-content-text">{content}</p>
      </div>
    </div>
  );
};

export default ViewBlog;
