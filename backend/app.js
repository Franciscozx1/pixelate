const express = require("express");
const cors    = require("cors");

require("./db");

const app = express();

// ─── MIDDLEWARES ─────────────────────────────────────────
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // porta padrão do Vite
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204
}));

// ─── ROTAS DA API ─────────────────────────────────────────
const usuariosRoutes   = require("./routes/usuarios");
const eventosRoutes    = require("./routes/eventos");
const inscricoesRoutes = require("./routes/inscricoes");
const avaliacoesRoutes = require("./routes/avaliacoes");
const fotosRoutes      = require("./routes/fotos");

app.use("/usuarios",   usuariosRoutes);
app.use("/eventos",    eventosRoutes);
app.use("/inscricoes", inscricoesRoutes);
app.use("/avaliacoes", avaliacoesRoutes);
app.use("/fotos",      fotosRoutes);

// ─── INICIAR SERVIDOR ────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
