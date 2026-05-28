const Foto = require("../models/foto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração do multer — salva em /public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `foto_${Date.now()}${ext}`;
    cb(null, nome);
  }
});

const fileFilter = (req, file, cb) => {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido. Use JPG, PNG, WEBP ou GIF."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middleware de upload (exportado para usar na rota)
const uploadMiddleware = upload.single("foto");

// Listar fotos de um evento
const listarFotos = async (req, res) => {
  try {
    const fotos = await Foto.find(
      { id_evento: Number(req.params.id_evento) },
      { _id: 0, __v: 0 }
    ).sort({ data_upload: -1 });

    res.json(fotos);
  } catch (err) {
    console.error("Erro ao listar fotos:", err);
    res.status(500).json({ error: "Erro ao listar fotos." });
  }
};

// Fazer upload de foto
const uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma foto enviada." });
    }

    const { id_usuario, id_evento } = req.body;

    if (!id_usuario || !id_evento) {
      return res.status(400).json({ error: "Campos obrigatórios: id_usuario, id_evento." });
    }

    const caminho = `/uploads/${req.file.filename}`;

    await Foto.create({
      id_usuario: Number(id_usuario),
      id_evento: Number(id_evento),
      nome_arquivo: req.file.originalname,
      caminho
    });

    res.status(201).json({
      message: "Foto enviada com sucesso!",
      caminho
    });
  } catch (err) {
    console.error("Erro ao salvar foto:", err);
    res.status(500).json({ error: "Erro ao salvar foto." });
  }
};

// Deletar foto
const deletarFoto = async (req, res) => {
  try {
    const foto = await Foto.findOne({ id_foto: Number(req.params.id) });

    if (!foto) {
      return res.status(404).json({ error: "Foto não encontrada." });
    }

    // Remove o arquivo do disco
    const caminhoCompleto = path.join(__dirname, "../public", foto.caminho);
    if (fs.existsSync(caminhoCompleto)) {
      fs.unlinkSync(caminhoCompleto);
    }

    await Foto.findOneAndDelete({ id_foto: Number(req.params.id) });

    res.json({ message: "Foto removida com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar foto:", err);
    res.status(500).json({ error: "Erro ao deletar foto." });
  }
};

module.exports = {
  uploadMiddleware,
  listarFotos,
  uploadFoto,
  deletarFoto
};