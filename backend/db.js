const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pixelate')
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log('Erro ao conectar no MongoDB:', err));

module.exports = mongoose;