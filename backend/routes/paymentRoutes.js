const express = require('express');
const router = express.Router();
const { depositFunds, transferFunds, getTransactionHistory } = require('../controllers/paymentController');

// NOTE: Agar aapke pass routes/authRoutes.js ke sath koi protect ya verifyToken middleware bana hua hai, 
// toh use yahan import karte hain. Abhi error se bachne ke liye hum direct routes de rahe hain.

router.post('/deposit', depositFunds);
router.post('/transfer', transferFunds);
router.get('/history', getTransactionHistory);

module.exports = router;