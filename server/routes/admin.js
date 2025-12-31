const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const User = require('../models/User');
const Ingredient = require('../models/Ingredient');
const Order = require('../models/Order');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get statistics (admin only)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Get sold items count
        const orders = await Order.find({ status: { $in: ['tayyorlanmoqda', 'tayyor', 'berilgan'] } });

        const soldItems = {};
        let totalCash = 0;

        orders.forEach(order => {
            order.items.forEach(item => {
                if (soldItems[item.name]) {
                    soldItems[item.name] += item.quantity;
                } else {
                    soldItems[item.name] = item.quantity;
                }
            });
            totalCash += order.total;
        });

        res.json({ soldItems, totalCash });
    } catch (error) {
        console.log('Get stats error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.log('Get users error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Add user (admin only)
router.post('/add-user', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        let { username, password, role } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username kiritilishi shart' });
        }

        // Auto-generate password if not provided
        if (!password) {
            password = randomstring.generate(8);
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu username allaqachon mavjud' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: role || 'hodim'
        });

        await user.save();

        res.json({ success: true, username, generatedPassword: password });
    } catch (error) {
        console.log('Add user error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Delete user (admin only)
router.delete('/delete-user/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ error: 'O\'zingizni o\'chira olmaysiz' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.log('Delete user error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Get ingredients (admin only)
router.get('/ingredients', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (error) {
        console.log('Get ingredients error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Update ingredients (admin only)
router.post('/update-ingredients', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Noto\'g\'ri ma\'lumot formati' });
        }

        for (const ing of ingredients) {
            const existing = await Ingredient.findOne({ item_name: ing.item_name });

            if (existing) {
                existing.start_quantity = ing.quantity;
                existing.remaining = ing.quantity;
                await existing.save();
            } else {
                const newIng = new Ingredient({
                    item_name: ing.item_name,
                    start_quantity: ing.quantity,
                    remaining: ing.quantity
                });
                await newIng.save();
            }
        }

        const allIngredients = await Ingredient.find();
        res.json({ success: true, ingredients: allIngredients });
    } catch (error) {
        console.log('Update ingredients error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

module.exports = router;
