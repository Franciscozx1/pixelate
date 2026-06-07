const Evento = require("../models/evento");
const Inscricao = require("../models/inscricao");

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

// Listar todos os eventos
const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({}, { _id: 0, __v: 0 });
    res.json(eventos);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({ error: "Erro ao listar eventos." });
  }
};

// Criar evento (Adaptado para ler FormData + Multer e blindar números)
const criarEvento = async (req, res) => {
  try {
    const { titulo, descricao, data_evento, hora_evento, local, vagas, valor, id_organizador, categoria } = req.body;

    if (!id_organizador) {
      return res.status(400).json({ error: "Usuário não logado." });
    }

    // A foto chega de forma separada pelo req.file. Vamos pegar o caminho gerado pelo Multer.
    let caminhoImagem = null;
    if (req.file) {
      caminhoImagem = `/uploads/${req.file.filename}`;
    }

    // 🛡️ BLINDAGEM DOS NÚMEROS: 
    const vagasConvertidas = Number(vagas) || 0;
    const valorConvertido = Number(valor) || 0;

    await Evento.create({
      titulo,
      descricao,
      data_evento,
      hora_evento,
      local,
      vagas: vagasConvertidas, 
      valor: valorConvertido,  
      categoria,
      id_organizador,
      imagem: caminhoImagem 
    });

    res.status(201).json({ message: "Evento criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro ao criar evento no banco." });
  }
};

// Atualizar evento (✅ CORRIGIDO E BLINDADO CONTRA NaN)
const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_evento, hora_evento, local, vagas, valor, categoria } = req.body;

    // 🛡️ BLINDAGEM DOS NÚMEROS IGUAL À CRIAÇÃO:
    const vagasConvertidas = Number(vagas) || 0;
    const valorConvertido = Number(valor) || 0;

    // Prepara o objeto padrão com os campos de texto modificados
    const dadosAtualizados = {
      titulo,
      descricao,
      data_evento,
      hora_evento,
      local,
      vagas: vagasConvertidas,
      valor: valorConvertido,
      categoria
    };

    // Se o usuário subiu uma NOVA foto durante a edição, adicionamos o novo caminho ao objeto de atualização
    if (req.file) {
      dadosAtualizados.imagem = `/uploads/${req.file.filename}`;
    }

    const evento = await Evento.findOneAndUpdate(
      { id_evento: Number(id) },
      dadosAtualizados, 
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

// Deletar evento e inscrições vinculadas
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
  listarDestaques,
  listarEventos,
  criarEvento,
  atualizarEvento,
  deletarEvento
};