const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    recipientEmail: {
        type: String,
        default: null // Sirf transfer ke waqt kaam aayega
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Completed' // Mock integration ke liye directly complete karenge
    },
    referenceId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);