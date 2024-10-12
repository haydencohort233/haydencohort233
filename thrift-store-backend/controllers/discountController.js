// controllers/discountController.js

const { db } = require('../config/db');
const { promisify } = require('util');

// Convert the callback-based query to a promise-based one
const query = promisify(db.query).bind(db);

exports.getActiveDiscounts = async (req, res) => {
    try {
        const discounts = await query(
            'SELECT * FROM discount_codes WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())'
        );

        if (!discounts || discounts.length === 0) {
            return res.status(404).json({ message: 'No active discounts found' });
        }

        res.status(200).json(discounts);
    } catch (error) {
        console.error('Error fetching active discounts:', error.message);
        res.status(500).json({ message: 'Failed to fetch active discounts', error: error.message });
    }
};

exports.validateDiscountCode = async (req, res) => {
    const { code } = req.body;

    console.log('Received discount code:', code); // Log the discount code received

    try {
        // Use the promise-based query to check if the discount code exists and is active
        const results = await query('SELECT * FROM discount_codes WHERE code = ? AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())', [code]);
        console.log('Query result:', results); // Log the query result to debug

        const discount = results[0]; // Access the first item from the query result

        if (!discount) {
            console.log('Discount code not found or expired'); // Additional logging
            return res.status(400).json({ message: 'Invalid or expired discount code.' });
        }

        console.log('Discount code is valid:', discount); // Log if the code is valid
        res.status(200).json({ message: 'Discount code is valid', discount });
    } catch (error) {
        console.error('Error validating discount code:', error);
        res.status(500).json({ message: 'Failed to validate discount code', error: error.message });
    }
};

exports.updateDiscount = async (req, res) => {
    const { discountId } = req.params;
    const { code, discountPercentage, expiryDate } = req.body;

    try {
        // Use the promise-based query to update the discount code in the database
        const result = await query(
            'UPDATE discount_codes SET code = ?, discount_percentage = ?, expires_at = ? WHERE id = ?',
            [code, discountPercentage, expiryDate || null, discountId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Discount code not found or not updated.' });
        }

        res.status(200).json({ message: 'Discount code updated successfully' });
    } catch (error) {
        console.error('Error updating discount code:', error);
        res.status(500).json({ message: 'Failed to update discount code', error: error.message });
    }
};

exports.addDiscount = async (req, res) => {
    const { code, discount_percentage, expires_at } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO discount_codes (code, discount_percentage, expires_at, is_active) VALUES (?, ?, ?, true)',
            [code, discount_percentage, expires_at]
        );
        res.status(201).json({ message: 'Discount code added successfully', discountId: result.insertId });
    } catch (error) {
        console.error('Error adding discount:', error);
        res.status(500).json({ message: 'Failed to add discount code' });
    }
};
