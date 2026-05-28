const mongoose = require('mongoose');
require('../db');
const Counter = require('./counter');

const InscricaoSchema = new mongoose.Schema({
  id_inscricao: { type: Number, unique: true },
  id_usuario: Number,
  id_evento: Number,
  data_inscricao: {
    type: String,
    default: () => new Date().toISOString()
  },
  status: {
    type: String,
    default: 'ativa'
  }
}, {
  collection: 'inscricoes'
});

InscricaoSchema.pre('save', async function () {
  if (this.id_inscricao) return;

  const counter = await Counter.findOneAndUpdate(
    { nome: 'inscricao' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  this.id_inscricao = counter.seq;
});

module.exports = mongoose.model('Inscricao', InscricaoSchema);