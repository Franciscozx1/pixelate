const express = require("express");
const router = express.Router();
const inscricoesController = require("../controllers/inscricoesController");

// Listar inscrições
router.get("/", inscricoesController.listarInscricoes);

// Criar inscrição
router.post("/", inscricoesController.criarInscricao);

// Atualizar inscrição
router.put("/:id_evento/:id_usuario", inscricoesController.atualizarInscricao);

// Deletar inscrição
router.delete("/:id_evento/:id_usuario", inscricoesController.deletarInscricao);

module.exports = router;
