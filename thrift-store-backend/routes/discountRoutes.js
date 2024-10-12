// routes/discountRoutes.js

const express = require('express');
const discountController = require('../controllers/discountController');
const router = express.Router();

// Route to validate a discount code
router.post('/validate', discountController.validateDiscountCode);

// Route to fetch all active discounts
router.get('/active', discountController.getActiveDiscounts);

router.post('/', discountController.addDiscount);

module.exports = router;
