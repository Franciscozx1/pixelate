const Usuario = require("../models/usuario");

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, { _id: 0, __v: 0 });
    res.json(usuarios);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

const buscarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOne(
      { id_usuario: Number(req.params.id) },
      { _id: 0, nome: 1, email: 1, id_usuario: 1 }
    );

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    await Usuario.create({ nome, email, senha });

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar:", err);
    res.status(500).json({ error: "Erro ao criar o usuário." });
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senhaConfirmacao } = req.body;
  const idUsuario = Number(req.params.id);

  try {
    const usuario = await Usuario.findOne({ id_usuario: idUsuario });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (usuario.senha !== senhaConfirmacao) {
      return res.status(401).json({ error: "Senha incorreta! Alteração negada." });
    }

    usuario.nome = nome;
    usuario.email = email;
    await usuario.save();

    res.status(200).json({ message: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  loginUsuario,
  atualizarUsuario
};