const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");

// Listar eventos
router.get("/", eventosController.listarEventos);

// Criar evento
router.post("/", eventosController.criarEvento);

// Atualizar evento
router.put("/:id", eventosController.atualizarEvento);

// Deletar evento
router.delete("/:id", eventosController.deletarEvento);

module.exports = router;