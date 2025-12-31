const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    sections: [{
        name: String,
        items: [{
            _id: String,
            name: String,
            price: Number,
            description: String,
            image_url: String,
            recipe: [{
                ingredient: String,
                quantity: Number
            }]
        }]
    }]
});

module.exports = mongoose.model('Menu', menuSchema);
