const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  ism: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'tayyorlanmoqda', 'tayyor', 'berilgan'],
    default: 'pending'
  },
  time: {
    type: Date,
    default: Date.now
  },
  hodim_id: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Order', orderSchema);
