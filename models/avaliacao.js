const mongoose = require("mongoose");
 
const avaliacaoSchema = new mongoose.Schema({
  id_avaliacao: { type: Number, unique: true },
  id_usuario: { type: Number, required: true },
  id_evento: { type: Number, required: true },
  nota: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, default: "" },
  data_avaliacao: { type: Date, default: Date.now }
});
 
// Auto-incrementa id_avaliacao
avaliacaoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const ultima = await mongoose.model("Avaliacao").findOne().sort({ id_avaliacao: -1 });
    this.id_avaliacao = ultima ? ultima.id_avaliacao + 1 : 1;
  }
  next();
});
 
module.exports = mongoose.model("Avaliacao", avaliacaoSchema);