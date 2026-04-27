const categories = [
    'Food',
    'Rent',
    'Salary',
    'Entertainment',
    'Transport',
    'Utilities',
    'Health',
    'Shopping',
    'Others'
];

export const getCategories = (req, res) => {
    res.json(categories);
};
