import React, { useState, useEffect } from 'react';
import './EditDiscount.css';

const EditDiscount = ({ isOpen, onClose }) => {
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [code, setCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');

    // Fetch active discounts when the modal opens
    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:5000/api/discounts/active')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch active discounts');
                    }
                    return response.json();
                })
                .then(data => {
                    setDiscounts(data);
                })
                .catch(error => {
                    console.error('Error fetching active discounts:', error);
                    setError('Failed to load active discounts. Please try again.');
                });
        }
    }, [isOpen]);

    // Load selected discount details
    useEffect(() => {
        if (selectedDiscount) {
            setCode(selectedDiscount.code);
            setDiscountPercentage(selectedDiscount.discount_percentage);
            setExpiryDate(selectedDiscount.expires_at ? selectedDiscount.expires_at.split('T')[0] : '');
        }
    }, [selectedDiscount]);

    // Handle form submission to update the discount
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/discounts/${selectedDiscount.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, discountPercentage, expiryDate }),
            });

            if (response.ok) {
                setError(''); // Clear any existing errors
                console.log('Discount code updated successfully.');
                handleClose(); // Close the modal after a successful update
            } else {
                throw new Error('Failed to update the discount code.');
            }
        } catch (error) {
            console.error('Error updating discount code:', error);
            setError('Failed to update the discount code. Please try again.');
        }
    };

    // Reset the fields when going back or closing the modal
    const resetFields = () => {
        setCode('');
        setDiscountPercentage(0);
        setExpiryDate('');
        setSelectedDiscount(null);
    };

    // Handle back button click to return to the discount list
    const handleBack = () => {
        resetFields(); // Reset the fields when going back to the list
    };

    // Handle modal close
    const handleClose = () => {
        resetFields(); // Reset the fields when closing the modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="edit-discount-modal-overlay">
            <div className="edit-discount-modal-content">
                <h2>Edit Discount Code</h2>
                <span className="edit-discount-close-button" onClick={onClose}>×</span>
                {error && <p className="edit-discount-error-message">{error}</p>}

                {!selectedDiscount ? (
                    <div className="discount-list">
                        <h3>Select a Discount to Edit</h3>
                        <ul>
                            {discounts.map(discount => (
                                <li key={discount.id} onClick={() => setSelectedDiscount(discount)}>
                                    {discount.code} - {discount.discount_percentage}% Off
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>Discount Code</label>
                        <input 
                            type="text" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            required 
                        />

                        <label>Discount Percentage</label>
                        <input 
                            type="number" 
                            value={discountPercentage} 
                            onChange={(e) => setDiscountPercentage(e.target.value)} 
                            required 
                        />

                        <label>Expiry Date</label>
                        <input 
                            type="date" 
                            value={expiryDate} 
                            onChange={(e) => setExpiryDate(e.target.value)} 
                        />

                        <div className="edit-discount-buttons">
                            <button type="button" className="edit-discount-back-button" onClick={handleBack}>
                                ← Back to Active Discounts
                            </button>
                            <button type="button" onClick={handleClose}>Cancel</button>
                            <button type="submit">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditDiscount;
