const express = require("express");
const router = express.Router();
const avaliacoesController = require("../controllers/avaliacoesController");
 
// Listar avaliações de um evento
router.get("/evento/:id_evento", avaliacoesController.listarAvaliacoes);
 
// Média de um evento
router.get("/evento/:id_evento/media", avaliacoesController.mediaAvaliacao);
 
// Criar avaliação
router.post("/", avaliacoesController.criarAvaliacao);
 
// Deletar avaliação
router.delete("/:id", avaliacoesController.deletarAvaliacao);
 
module.exports = router;