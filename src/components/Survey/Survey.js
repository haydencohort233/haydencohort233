import React, { useState } from 'react';
import './Survey.css';

const Survey = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    experience: 5,
    firsttime: 'yes',
    hearabout: '',
    comments: '',
    didthispage: '',
    vendorsuggestion: '',
    guestsuggestion: '',
    foodsuggestion: '',
  });

  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure that the data is correctly formatted
    if (!formData.experience || !formData.firsttime || !formData.didthispage) {
      setError('Please fill out all required fields.');
      return;
    }

    // Replace with your backend API endpoint
    fetch('http://localhost:5000/api/guestfeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        setSubmitted(true);
        onClose();
      })
      .catch((err) => {
        console.error('Error submitting survey:', err);
        setError('An error occurred while submitting your feedback.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <h2>Website Feedback Survey</h2>
        {submitted ? (
          <p>Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              How did you enjoy our website? (1-10):
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="1"
                max="10"
                required
              />
            </label>

            <label>
              Is this your first time visiting our website?
              <select name="firsttime" value={formData.firsttime} onChange={handleChange} required>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label>
              How did you hear about Chasing Nostalgia?
              <input
                type="text"
                name="hearabout"
                value={formData.hearabout}
                onChange={handleChange}
              />
            </label>

            <label>
              Additional Comments:
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                maxLength="255"
              ></textarea>
            </label>

            <label>
              Did this page help you?
              <div className="thumb-buttons">
                <button
                  type="button"
                  className={`thumb ${formData.didthispage === 'up' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, didthispage: 'up' })}
                >
                  👍
                </button>
                <button
                  type="button"
                  className={`thumb ${formData.didthispage === 'down' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, didthispage: 'down' })}
                >
                  👎
                </button>
              </div>
            </label>

            <label>
              Suggest a Vendor:
              <input
                type="text"
                name="vendorsuggestion"
                value={formData.vendorsuggestion}
                onChange={handleChange}
              />
            </label>

            <label>
              Suggest a Guest Vendor:
              <input
                type="text"
                name="guestsuggestion"
                value={formData.guestsuggestion}
                onChange={handleChange}
              />
            </label>

            <label>
              Suggest a Food Vendor:
              <input
                type="text"
                name="foodsuggestion"
                value={formData.foodsuggestion}
                onChange={handleChange}
              />
            </label>

            {error && <p className="error">{error}</p>}
            <button type="submit">Submit Feedback</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Survey;
