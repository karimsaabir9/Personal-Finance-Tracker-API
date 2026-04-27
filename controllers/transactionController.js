import Transaction from '../models/TransactionModel.js';

// Add Transaction
export const addTransaction = async (req, res, next) => {
    try {
        const { title, amount, type, category, date } = req.body;
        const transaction = await Transaction.create({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            date
        });
        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};

// Get All Transactions
export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        next(err);
    }
};

// Update Transaction
export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json(transaction);
    } catch (err) {
        next(err);
    }
};

// Delete Transaction
export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction removed' });
    } catch (err) {
        next(err);
    }
};

// Monthly Summary
export const getMonthlySummary = async (req, res, next) => {
    try {
        const summary = await Transaction.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: { type: "$type", category: "$category" },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id.type",
                    category: "$_id.category",
                    totalAmount: 1,
                    count: 1
                }
            },
            { $sort: { type: 1, totalAmount: -1 } }
        ]);

        res.json(summary);
    } catch (err) {
        next(err);
    }
};
