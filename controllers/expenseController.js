import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createExpense = async (req, res) => {
    try {
        const { date, category, amount, description, paymentMethod, notes } = req.body;

        const expense = new Expense({
            userId: req.user._id,
            date,
            category,
            amount,
            description,
            paymentMethod,
            notes
        });

        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            if (expense.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            expense.date = req.body.date || expense.date;
            expense.category = req.body.category || expense.category;
            expense.amount = req.body.amount || expense.amount;
            expense.description = req.body.description || expense.description;
            expense.paymentMethod = req.body.paymentMethod || expense.paymentMethod;
            expense.notes = req.body.notes || expense.notes;

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            if (expense.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await expense.deleteOne();
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
