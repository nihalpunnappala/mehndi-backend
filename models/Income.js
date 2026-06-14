import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Income = mongoose.model('Income', incomeSchema);
export default Income;
