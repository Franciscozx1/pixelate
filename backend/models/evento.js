const mongoose = require('../db');
const Counter = require('./counter');

const EventoSchema = new mongoose.Schema({
  id_evento: { type: Number, unique: true },
  titulo: String,
  descricao: String, 
  data_evento: String,
  hora_evento: String,
  local: String,
  vagas: Number,
  valor: Number,
  id_organizador: Number,
  
  // --- CAMPOS NOVOS AQUI DENTRO ---
  imagem: String,
  visitas: { type: Number, default: 0 }
});

EventoSchema.pre('save', async function () {
  if (this.id_evento) return;

  const counter = await Counter.findOneAndUpdate(
    { nome: 'evento' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  this.id_evento = counter.seq;
});

module.exports = mongoose.model('Evento', EventoSchema);