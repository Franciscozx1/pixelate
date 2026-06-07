const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");

// Importando o "desempacotador" de fotos (o multer) que já estava pronto no fotosController
const { uploadMiddleware } = require("../controllers/fotosController");

// NOVA ROTA: Listar eventos em destaque (CARROSSEL)
router.get("/destaques", eventosController.listarDestaques);

// Listar eventos
router.get("/", eventosController.listarEventos);

// Criar evento (✅ AGORA TEM O MULTER AQUI)
router.post("/", uploadMiddleware, eventosController.criarEvento);

// Atualizar evento (✅ AGORA TEM O MULTER AQUI TAMBÉM)
router.put("/:id", uploadMiddleware, eventosController.atualizarEvento);

// Deletar evento
router.delete("/:id", eventosController.deletarEvento);

module.exports = router;