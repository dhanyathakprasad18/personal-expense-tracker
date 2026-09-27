const express = require("express");
const Expense = require("../models/Expense");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Add a new expense
router.post("/", protect, async (req, res) => {
    try {
        const {
            amount,
            category,
            description,
            date,
            paymentMethod
        } = req.body;

        if (!amount || !category || !date || !paymentMethod) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const expense = new Expense({
            userId: req.userId,
            amount,
            category,
            description,
            date,
            paymentMethod
        });

        await expense.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Get, search and filter expenses
router.get("/", protect, async (req, res) => {
    try {
        const { search, category, paymentMethod } = req.query;

        let filter = {
            userId: req.userId
        };

        // Search by description
        if (search) {
            filter.description = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by payment method
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        const expenses = await Expense.find(filter).sort({
            date: -1
        });

        res.json(expenses);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Update an expense
router.put("/:id", protect, async (req, res) => {
    try {
        const {
            amount,
            category,
            description,
            date,
            paymentMethod
        } = req.body;

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        expense.amount = amount;
        expense.category = category;
        expense.description = description;
        expense.date = date;
        expense.paymentMethod = paymentMethod;

        await expense.save();

        res.json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Delete an expense
router.delete("/:id", protect, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        await expense.deleteOne();

        res.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;