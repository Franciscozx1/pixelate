const express = require("express");
const router = express.Router();
const fotosController = require("../controllers/fotosController");
 
// Listar fotos de um evento
router.get("/evento/:id_evento", fotosController.listarFotos);
 
// Upload de foto
router.post("/", fotosController.uploadMiddleware, fotosController.uploadFoto);
 
// Deletar foto
router.delete("/:id", fotosController.deletarFoto);
 
module.exports = router;