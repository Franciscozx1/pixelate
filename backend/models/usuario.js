const mongoose = require('../db');
const Counter = require('./counter');

const UsuarioSchema = new mongoose.Schema({
  id_usuario: { type: Number, unique: true },
  nome: String,
  email: { type: String, unique: true },
  senha: String
});

// gera ID automático igual MySQL
UsuarioSchema.pre('save', async function () {
  if (this.id_usuario) return;

  const counter = await Counter.findOneAndUpdate(
    { nome: 'usuario' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  this.id_usuario = counter.seq;
});

module.exports = mongoose.model('Usuario', UsuarioSchema);