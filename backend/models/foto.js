const mongoose = require("mongoose");
 
const fotoSchema = new mongoose.Schema({
  id_foto: { type: Number, unique: true },
  id_usuario: { type: Number, required: true },
  id_evento: { type: Number, required: true },
  nome_arquivo: { type: String, required: true },
  caminho: { type: String, required: true },
  data_upload: { type: Date, default: Date.now }
});
 
// Auto-incrementa id_foto
fotoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const ultima = await mongoose.model("Foto").findOne().sort({ id_foto: -1 });
    this.id_foto = ultima ? ultima.id_foto + 1 : 1;
  }
  next();
});
 
module.exports = mongoose.model("Foto", fotoSchema);
 