import React, { useEffect, useRef } from 'react';
import './ViewBlog.css';

const ViewBlog = ({ blog, onClose }) => {
  const { title, content, date, modified_date, photo_url } = blog;
  const formattedDate = new Date(date).toLocaleDateString();
  const formattedModifiedDate = modified_date
    ? new Date(modified_date).toLocaleDateString()
    : null;

  const modalRef = useRef(null);

  // Function to render content with line breaks
  const renderContentWithLineBreaks = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Close modal on clicking outside of it or pressing Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="view-blog-modal">
      <div className="view-blog-content" ref={modalRef}>
        <button className="close-modal-button" onClick={onClose}>
          X
        </button>
        <h2>{title}</h2>
        <p className="view-blog-date">Posted: {formattedDate}</p>
        {formattedModifiedDate && formattedModifiedDate !== formattedDate && (
          <p className="view-blog-modified-date">Modified: {formattedModifiedDate}</p>
        )}
        {photo_url && (
          <img
            src={`http://localhost:5000${photo_url}`}
            alt={title}
            className="view-blog-image"
          />
        )}
        <div className="view-blog-content-text">
          {renderContentWithLineBreaks(content)}
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
