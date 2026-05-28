const express = require("express");
const app = express();

app.use(express.json());
// Dentro do seu arquivo app.js

const cors = require("cors");

const corsOptions = {
  origin: '*', // Permite requisições de qualquer origem
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite todos os métodos HTTP
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Importando rotas
const usuariosRoutes = require("./routes/usuarios");
const eventosRoutes = require("./routes/eventos");
const inscricoesRoutes = require("./routes/inscricoes");

app.use("/usuarios", usuariosRoutes);
app.use("/eventos", eventosRoutes);
app.use("/inscricoes", inscricoesRoutes);

app.get('/cadastro-login', (req, res) => {
    console.log("Requisição para /cadastro-login recebida!");
    res.sendFile(path.join(__dirname, 'public', 'cadastro-login.html'));
});

// Iniciando servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

