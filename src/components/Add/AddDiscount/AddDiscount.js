import React, { useState } from 'react';
import './AddDiscount.css';

const AddDiscount = ({ isOpen, onClose }) => {
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/discounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    discount_percentage: discountPercentage,
                    expires_at: expiryDate,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Discount code added successfully.');
                resetFields(); // Clear the form fields after successful addition
                onClose(); // Close the modal after adding the discount
            } else {
                throw new Error('Failed to add the discount code. Please try again.');
            }
        } catch (error) {
            console.error('Error adding discount code:', error);
            setError('Failed to add the discount code. Please try again.');
        }
    };

    const resetFields = () => {
        setCode('');
        setDiscountPercentage(0);
        setExpiryDate('');
    };

    const handleClose = () => {
        resetFields();
        setError(''); // Clear any error messages
        setSuccessMessage(''); // Clear any success messages
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="add-discount-modal-overlay">
            <div className="add-discount-modal-content">
                <h2 className="add-discount-title">Add Discount Code</h2>
                <span className="add-discount-close-button" onClick={handleClose}>×</span>
                {error && <p className="add-discount-error-message">{error}</p>}
                {successMessage && <p className="add-discount-success-message">{successMessage}</p>}
                <form className="add-discount-form" onSubmit={handleSubmit}>
                    <label className="add-discount-label">Discount Code</label>
                    <input 
                        type="text" 
                        value={code} 
                        className="add-discount-input"
                        onChange={(e) => setCode(e.target.value)} 
                        required 
                    />

                    <label className="add-discount-label">Discount Percentage</label>
                    <input 
                        type="number" 
                        value={discountPercentage} 
                        className="add-discount-input"
                        onChange={(e) => setDiscountPercentage(e.target.value)} 
                        required 
                    />

                    <label className="add-discount-label">Expiry Date</label>
                    <input 
                        type="date" 
                        value={expiryDate} 
                        className="add-discount-input"
                        onChange={(e) => setExpiryDate(e.target.value)} 
                    />

                    <div className="add-discount-buttons">
                        <button type="submit" className="add-discount-save-button">Add Discount</button>
                        <button type="button" className="add-discount-cancel-button" onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDiscount;
