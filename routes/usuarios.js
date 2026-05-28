const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Listar todos
router.get("/", usuariosController.listarUsuarios);

// Buscar por ID
router.get("/:id", usuariosController.buscarUsuario);

// Criar usuário
router.post("/", usuariosController.criarUsuario);

// Login
router.post("/login", usuariosController.loginUsuario);

// Atualizar perfil
router.put("/:id", usuariosController.atualizarUsuario);

module.exports = router;