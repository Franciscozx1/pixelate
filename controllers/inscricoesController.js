const Inscricao = require("../models/inscricao");

const listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({}, { _id: 0, __v: 0 });
    res.json(inscricoes);
  } catch (error) {
    console.error("Erro ao listar inscrições:", error);
    res.status(500).json({ error: "Erro ao listar inscrições." });
  }
};

const criarInscricao = async (req, res) => {
  try {
    const { id_usuario, id_evento } = req.body;

    const inscricaoExistente = await Inscricao.findOne({
      id_usuario: Number(id_usuario),
      id_evento: Number(id_evento)
    });

    if (inscricaoExistente) {
      return res.status(400).json({ error: "Usuário já inscrito neste evento." });
    }

    await Inscricao.create({
      id_usuario: Number(id_usuario),
      id_evento: Number(id_evento)
    });

    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao realizar inscrição:", error);
    res.status(500).json({ error: "Erro ao realizar inscrição. Verifique os IDs de usuário e evento." });
  }
};

const atualizarInscricao = async (req, res) => {
  try {
    const { id_evento, id_usuario } = req.params;
    const { data_inscricao, status } = req.body;

    const inscricao = await Inscricao.findOneAndUpdate(
      {
        id_evento: Number(id_evento),
        id_usuario: Number(id_usuario)
      },
      {
        data_inscricao,
        status
      },
      { returnDocument: 'after' }
    );

    if (!inscricao) {
      return res.status(404).json({ error: "Inscrição não encontrada." });
    }

    res.status(200).json({ message: "Inscrição atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    res.status(500).json({ error: "Erro ao atualizar inscrição." });
  }
};

const deletarInscricao = async (req, res) => {
  try {
    const { id_evento, id_usuario } = req.params;

    await Inscricao.deleteOne({
      id_evento: Number(id_evento),
      id_usuario: Number(id_usuario)
    });

    res.status(200).json({ message: "Inscrição cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({ error: "Erro ao cancelar inscrição." });
  }
};

module.exports = {
  listarInscricoes,
  criarInscricao,
  atualizarInscricao,
  deletarInscricao
};