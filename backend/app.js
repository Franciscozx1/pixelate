const express = require("express");
const cors    = require("cors");
const path    = require("path"); // 1️⃣ ADICIONADO: Importar a biblioteca de caminhos

require("./db");

const app = express();

// ─── MIDDLEWARES ─────────────────────────────────────────
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // porta padrão do Vite
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204
}));

// 2️⃣ ADICIONADO: Liberar acesso público à pasta de uploads
// Como o multer salva em "../public/uploads" a partir da pasta controllers, 
// a pasta public fica na raiz do backend.
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

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