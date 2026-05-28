const Evento = require("../models/evento");
const Inscricao = require("../models/inscricao");

// --- NOVA FUNÇÃO PARA O CARROSSEL ---
// --- NOVA FUNÇÃO PARA O CARROSSEL (BASEADA EM INSCRIÇÕES) ---
const listarDestaques = async (req, res) => {
  try {
    // 1. Busca todos os eventos. O .lean() transforma em um objeto JS puro pra facilitar
    const eventos = await Evento.find({}, { _id: 0, __v: 0 }).lean();

    // 2. Conta as inscrições no banco para cada evento
    const eventosComContagem = await Promise.all(
      eventos.map(async (evento) => {
        const totalInscricoes = await Inscricao.countDocuments({ id_evento: evento.id_evento });
        return { ...evento, totalInscricoes };
      })
    );

    // 3. Ordena a lista do maior número de inscrições para o menor
    eventosComContagem.sort((a, b) => b.totalInscricoes - a.totalInscricoes);

    // 4. Recorta e envia apenas os 3 primeiros para o frontend
    const top3 = eventosComContagem.slice(0, 3);

    res.json(top3);
  } catch (error) {
    console.error("Erro ao listar destaques:", error);
    res.status(500).json({ error: "Erro ao listar eventos de destaque." });
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({}, { _id: 0, __v: 0 });
    res.json(eventos);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({ error: "Erro ao listar eventos." });
  }
};

const criarEvento = async (req, res) => {
  try {
    // ADICIONADO a "imagem" aqui no destructuring
    const { titulo, descricao, data_evento, hora_evento, local, vagas, valor, id_organizador, imagem } = req.body;

    if (!id_organizador) {
      return res.status(400).json({ error: "Usuário não logado." });
    }

    await Evento.create({
      titulo,
      descricao,
      data_evento,
      hora_evento,
      local,
      vagas,
      valor,
      id_organizador,
      imagem // ADICIONADO pro banco salvar a foto
    });

    res.status(201).json({ message: "Evento criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro ao criar evento no banco." });
  }
};

const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    // ADICIONADO a "imagem" aqui no destructuring
    const { titulo, descricao, data_evento, hora_evento, local, vagas, valor, imagem } = req.body;

    const evento = await Evento.findOneAndUpdate(
      { id_evento: Number(id) },
      { titulo, descricao, data_evento, hora_evento, local, vagas, valor, imagem }, // ADICIONADO aqui também
      { returnDocument: 'after' }
    );

    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    res.status(200).json({ message: "Evento atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({ error: "Erro ao atualizar evento. Verifique os dados." });
  }
};

const deletarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const idEvento = Number(id);

    await Inscricao.deleteMany({ id_evento: idEvento });
    await Evento.deleteOne({ id_evento: idEvento });

    res.status(200).json({ message: "Evento e inscrições relacionados deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    res.status(500).json({ error: "Erro ao deletar evento." });
  }
};

module.exports = {
  listarDestaques, // EXPORTANDO a nova função
  listarEventos,
  criarEvento,
  atualizarEvento,
  deletarEvento
};