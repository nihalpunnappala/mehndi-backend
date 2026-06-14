import Income from '../models/Income.js';

export const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createIncome = async (req, res) => {
    try {
        const { date, clientName, serviceType, quantity, unitPrice, amount, paymentMethod, notes } = req.body;

        const income = new Income({
            userId: req.user._id,
            date,
            clientName,
            serviceType,
            quantity,
            unitPrice,
            amount,
            paymentMethod,
            notes
        });

        const createdIncome = await income.save();
        res.status(201).json(createdIncome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (income) {
            if (income.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            income.date = req.body.date || income.date;
            income.clientName = req.body.clientName || income.clientName;
            income.serviceType = req.body.serviceType || income.serviceType;
            income.quantity = req.body.quantity !== undefined ? req.body.quantity : income.quantity;
            income.unitPrice = req.body.unitPrice !== undefined ? req.body.unitPrice : income.unitPrice;
            income.amount = req.body.amount || income.amount;
            income.paymentMethod = req.body.paymentMethod || income.paymentMethod;
            income.notes = req.body.notes || income.notes;

            const updatedIncome = await income.save();
            res.json(updatedIncome);
        } else {
            res.status(404).json({ message: 'Income not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (income) {
            if (income.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await income.deleteOne();
            res.json({ message: 'Income removed' });
        } else {
            res.status(404).json({ message: 'Income not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
