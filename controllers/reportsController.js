import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import moment from 'moment';

export const getDashboardTotals = async (req, res) => {
    try {
        const userId = req.user._id;

        const incomes = await Income.find({ userId });
        const expenses = await Expense.find({ userId });

        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const netProfit = totalIncome - totalExpense;

        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const thisMonthIncomes = await Income.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const thisMonthExpenses = await Expense.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const thisMonthIncomeTotal = thisMonthIncomes.reduce((acc, curr) => acc + curr.amount, 0);
        const thisMonthExpenseTotal = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            totalIncome,
            totalExpense,
            netProfit,
            thisMonthIncome: thisMonthIncomeTotal,
            thisMonthExpense: thisMonthExpenseTotal,
            incomeEntriesCount: incomes.length,
            expenseEntriesCount: expenses.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const incomes = await Income.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalIncome: { $sum: "$amount" }
                }
            }
        ]);

        const expenses = await Expense.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);

        const summaryMap = {};

        incomes.forEach(i => {
            summaryMap[i._id] = { month: i._id, income: i.totalIncome, expense: 0, profit: i.totalIncome };
        });

        expenses.forEach(e => {
            if (summaryMap[e._id]) {
                summaryMap[e._id].expense = e.totalExpense;
                summaryMap[e._id].profit = summaryMap[e._id].income - e.totalExpense;
            } else {
                summaryMap[e._id] = { month: e._id, income: 0, expense: e.totalExpense, profit: -e.totalExpense };
            }
        });

        const result = Object.values(summaryMap).sort((a, b) => a.month.localeCompare(b.month));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
