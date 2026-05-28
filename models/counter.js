const mongoose = require('../db');

const CounterSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', CounterSchema);