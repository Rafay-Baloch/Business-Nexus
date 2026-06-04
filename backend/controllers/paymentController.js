const Transaction = require('../models/Transaction');

// 1. Handle Deposit (Paise Add Karna)
exports.depositFunds = async (req, res) => {
    try {
        const { amount, userId } = req.body; // Abhi test karne ke liye frontend se userId le rahe hain
        const mockRefId = 'tx_' + Math.random().toString(36).substr(2, 9);

        const newTx = new Transaction({
            userId: userId || "64f1a2b3c4d5e6f7a8b9c0d1", // Agar login nahi bhi hai toh fake ID lag jayegi
            type: 'deposit',
            amount: parseFloat(amount),
            referenceId: mockRefId,
            status: 'Completed'
        });

        await newTx.save();
        res.status(201).json({ success: true, message: "Deposit Successful", transaction: newTx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Handle Transfer (Paise Bhejna)
exports.transferFunds = async (req, res) => {
    try {
        const { recipientEmail, amount, userId } = req.body;
        const mockRefId = 'tx_' + Math.random().toString(36).substr(2, 9);

        if (!recipientEmail || !amount) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newTx = new Transaction({
            userId: userId || "64f1a2b3c4d5e6f7a8b9c0d1",
            type: 'transfer',
            amount: parseFloat(amount),
            recipientEmail: recipientEmail,
            referenceId: mockRefId,
            status: 'Completed'
        });

        await newTx.save();
        res.status(201).json({ success: true, message: "Transfer Successful", transaction: newTx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Transaction History
exports.getTransactionHistory = async (req, res) => {
    try {
        // Abhi sub transactions nikal letay hain query check karne ke liye
        const history = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};