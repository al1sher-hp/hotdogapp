const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        unique: true
    },
    start_quantity: {
        type: Number,
        required: true,
        default: 0
    },
    remaining: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
