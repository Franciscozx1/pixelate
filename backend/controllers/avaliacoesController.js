const Avaliacao = require("../models/avaliacao");

// Listar avaliações de um evento
const listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find(
      { id_evento: Number(req.params.id_evento) },
      { _id: 0, __v: 0 }
    ).sort({ data_avaliacao: -1 });

    res.json(avaliacoes);
  } catch (err) {
    console.error("Erro ao listar avaliações:", err);
    res.status(500).json({ error: "Erro ao listar avaliações." });
  }
};

// Criar avaliação
const criarAvaliacao = async (req, res) => {
  try {
    const { id_usuario, id_evento, nota, comentario } = req.body;

    if (!id_usuario || !id_evento || !nota) {
      return res.status(400).json({ error: "Campos obrigatórios: id_usuario, id_evento, nota." });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ error: "A nota deve ser entre 1 e 5." });
    }

    // Impede avaliação duplicada do mesmo usuário no mesmo evento
    const jaAvaliou = await Avaliacao.findOne({ id_usuario, id_evento });
    if (jaAvaliou) {
      return res.status(400).json({ error: "Você já avaliou este evento." });
    }

    await Avaliacao.create({ id_usuario, id_evento, nota, comentario });

    res.status(201).json({ message: "Avaliação enviada com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar avaliação:", err);
    res.status(500).json({ error: "Erro ao criar avaliação." });
  }
};

// Média de notas de um evento
const mediaAvaliacao = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ id_evento: Number(req.params.id_evento) });

    if (avaliacoes.length === 0) {
      return res.json({ media: 0, total: 0 });
    }

    const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
    const media = (soma / avaliacoes.length).toFixed(1);

    res.json({ media: Number(media), total: avaliacoes.length });
  } catch (err) {
    console.error("Erro ao calcular média:", err);
    res.status(500).json({ error: "Erro ao calcular média." });
  }
};

// Deletar avaliação
const deletarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findOneAndDelete({
      id_avaliacao: Number(req.params.id)
    });

    if (!avaliacao) {
      return res.status(404).json({ error: "Avaliação não encontrada." });
    }

    res.json({ message: "Avaliação removida com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar avaliação:", err);
    res.status(500).json({ error: "Erro ao deletar avaliação." });
  }
};

module.exports = {
  listarAvaliacoes,
  criarAvaliacao,
  mediaAvaliacao,
  deletarAvaliacao
};