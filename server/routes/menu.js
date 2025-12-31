const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const { uploadToImgBB } = require('../utils/uploadImage');
const randomstring = require('randomstring');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get menu (public)
router.get('/get-menu', async (req, res) => {
    try {
        let menu = await Menu.findOne();

        if (!menu) {
            // Create default menu if doesn't exist
            menu = new Menu({ sections: [] });
            await menu.save();
        }

        res.json(menu);
    } catch (error) {
        console.log('Get menu error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Add section (admin only)
router.post('/add-section', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Bo\'lim nomi kiritilishi shart' });
        }

        let menu = await Menu.findOne();
        if (!menu) {
            menu = new Menu({ sections: [] });
        }

        menu.sections.push({ name, items: [] });
        await menu.save();

        req.app.get('io').emit('menu-update', menu);

        res.json({ success: true, menu });
    } catch (error) {
        console.log('Add section error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Add item (admin only)
router.post('/add-item', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { sectionName, name, price, description, recipe } = req.body;

        if (!sectionName || !name || !price) {
            return res.status(400).json({ error: 'Barcha maydonlar to\'ldirilishi shart' });
        }

        let imageUrl = '';

        // Upload image to ImgBB if provided
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.buffer, process.env.IMGBB_API_KEY);
        }

        let menu = await Menu.findOne();
        if (!menu) {
            menu = new Menu({ sections: [] });
        }

        const section = menu.sections.find(s => s.name === sectionName);
        if (!section) {
            return res.status(404).json({ error: 'Bo\'lim topilmadi' });
        }

        const newItem = {
            _id: randomstring.generate(10),
            name,
            price: parseFloat(price),
            description: description || '',
            image_url: imageUrl,
            recipe: recipe ? JSON.parse(recipe) : []
        };

        section.items.push(newItem);
        await menu.save();

        req.app.get('io').emit('menu-update', menu);

        res.json({ success: true, menu });
    } catch (error) {
        console.log('Add item error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Delete item (admin only)
router.delete('/delete-item/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const menu = await Menu.findOne();
        if (!menu) {
            return res.status(404).json({ error: 'Menu topilmadi' });
        }

        let found = false;
        for (const section of menu.sections) {
            const index = section.items.findIndex(item => item._id === req.params.id);
            if (index !== -1) {
                section.items.splice(index, 1);
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ error: 'Mahsulot topilmadi' });
        }

        await menu.save();
        req.app.get('io').emit('menu-update', menu);

        res.json({ success: true, menu });
    } catch (error) {
        console.log('Delete item error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

// Edit item (admin only)
router.put('/edit-item/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, recipe } = req.body;

        const menu = await Menu.findOne();
        if (!menu) {
            return res.status(404).json({ error: 'Menu topilmadi' });
        }

        let item = null;
        for (const section of menu.sections) {
            item = section.items.find(i => i._id === req.params.id);
            if (item) break;
        }

        if (!item) {
            return res.status(404).json({ error: 'Mahsulot topilmadi' });
        }

        if (name) item.name = name;
        if (price) item.price = parseFloat(price);
        if (description !== undefined) item.description = description;
        if (recipe) item.recipe = JSON.parse(recipe);

        // Upload new image if provided
        if (req.file) {
            item.image_url = await uploadToImgBB(req.file.buffer, process.env.IMGBB_API_KEY);
        }

        await menu.save();
        req.app.get('io').emit('menu-update', menu);

        res.json({ success: true, menu });
    } catch (error) {
        console.log('Edit item error:', error);
        res.status(500).json({ error: 'Xato yuz berdi' });
    }
});

module.exports = router;
