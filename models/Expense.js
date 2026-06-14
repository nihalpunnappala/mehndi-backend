import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Henna Powder', 'Essential Oil', 'Lemon', 'Piping Bag', 'Cling Wrap', 'Tape', 'Cover', 'Cellophane Sheet', 'Logo Sticker', 'Travel Expenses', 'Nail Liquid']
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
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

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
