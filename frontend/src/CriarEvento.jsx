import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import './CriarEvento.css'
import { useAuth } from './hooks/useAuth'

const API = 'http://localhost:3000'
const CATEGORIAS = ['Tecnologia', 'Música', 'Esportes', 'Arte', 'Gastronomia', 'Educação', 'Games', 'Outro']

function FormEvento({ inicial, onSalvar, onCancelar, loading }) {
  const [form, setForm] = useState(inicial || {
    titulo: '', descricao: '', data_evento: '', hora_evento: '',
    local: '', vagas: '', valor: '', categoria: ''
  })
  const [arquivoFoto, setArquivoFoto] = useState(null)
  const [previewFoto, setPreviewFoto] = useState(inicial?.foto || '')

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setArquivoFoto(file)
    setPreviewFoto(URL.createObjectURL(file))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar(form, arquivoFoto)
  }

  return (
    <form className="ce-form" onSubmit={handleSubmit}>
      <div className="ce-grid">
        <div className="ce-campo">
          <label>Título</label>
          <input value={form.titulo} onChange={e => set('titulo', e.target.value)} required placeholder="Nome do evento" />
        </div>
        <div className="ce-campo">
          <label>Local</label>
          <input value={form.local} onChange={e => set('local', e.target.value)} placeholder="Cidade, endereço..." />
        </div>
        <div className="ce-campo">
          <label>Data</label>
          <input type="date" value={form.data_evento} onChange={e => set('data_evento', e.target.value)} />
        </div>
        <div className="ce-campo">
          <label>Horário</label>
          <input value={form.hora_evento} onChange={e => set('hora_evento', e.target.value)} placeholder="Ex: 14h às 18h" />
        </div>
        <div className="ce-campo">
          <label>Vagas</label>
          <input type="number" value={form.vagas} onChange={e => set('vagas', e.target.value)} placeholder="0" min="0" />
        </div>
        <div className="ce-campo">
          <label>Valor (R$)</label>
          <input type="number" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="ce-campo ce-campo-full">
          <label>Categoria</label>
          <select value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            <option value="">Selecione...</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ─── CAMPO DE FOTO ─── */}
        <div className="ce-campo ce-campo-full">
          <label>Foto do evento</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
          />
          {previewFoto && (
            <img
              src={previewFoto}
              alt="Preview da foto"
              style={{ marginTop: 10, maxHeight: 180, borderRadius: 8, objectFit: 'cover' }}
            />
          )}
        </div>

        <div className="ce-campo ce-campo-full">
          <label>Descrição</label>
          <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)} rows={4} placeholder="Descreva o evento..." />
        </div>
      </div>
      <div className="ce-acoes">
        {onCancelar && <button type="button" className="btn-ce-cancelar" onClick={onCancelar}>Cancelar</button>}
        <button type="submit" className="btn-ce-salvar" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar evento'}
        </button>
      </div>
    </form>
  )
}

function CardEvento({ evento, onEditar, onDeletar }) {
  function formatarData(data) {
    if (!data) return 'A definir'
    const p = data.split('T')[0].split('-')
    return `${p[2]}/${p[1]}/${p[0]}`
  }

  // 🛠️ RESOLUÇÃO DA IMAGEM: Concatenamos a URL da API com o caminho salvo do banco (evento.imagem)
  const urlDaImagem = evento.imagem 
    ? `${API}${evento.imagem}` 
    : '/assets/pixelate.jpg';

  return (
    <div className="ce-card">
      <div
        className="ce-card-img"
        style={{ backgroundImage: `url('${urlDaImagem}')` }}
      >
        {evento.categoria && <span className="ce-tag">{evento.categoria}</span>}
      </div>
      <div className="ce-card-body">
        <h3 className="ce-card-titulo">{evento.titulo}</h3>
        <p className="ce-card-meta">📅 {formatarData(evento.data_evento)} · 📍 {evento.local || 'A definir'}</p>
        <div className="ce-card-btns">
          <button className="btn-editar" onClick={() => onEditar(evento)}>✏️ Editar</button>
          <button className="btn-deletar" onClick={() => onDeletar(evento.id_evento)}>🗑️ Deletar</button>
        </div>
      </div>
    </div>
  )
}

export default function CriarEvento() {

  const { userId } = useAuth()
  const [meusEventos, setMeusEventos] = useState([])
  const [editando, setEditando] = useState(null)
  const [criando, setCriando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    if (userId) carregarMeusEventos()
  }, [userId])

  async function carregarMeusEventos() {
    try {
      const res = await fetch(`${API}/eventos`)
      const data = await res.json()
      setMeusEventos(data.filter(e => String(e.id_organizador) === String(userId)))
    } catch { setErro('Erro ao carregar seus eventos.') }
  }

  // ─── Monta FormData com campos + arquivo (se houver) ───────────────────────
  function montarFormData(form, arquivoFoto, extras = {}) {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    Object.entries(extras).forEach(([k, v]) => fd.append(k, v))
    // 👇 AQUI ESTAVA O ERRO! Agora envia como "foto"
    if (arquivoFoto) fd.append('foto', arquivoFoto)
    return fd
  }

  async function handleCriar(form, arquivoFoto) {
    setLoading(true); setErro(''); setOk('')
    try {
      const fd = montarFormData(form, arquivoFoto, {
        id_organizador: userId,
        vagas: Number(form.vagas),
        valor: Number(form.valor)
      })

      const res = await fetch(`${API}/eventos`, { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok) {
        setOk('Evento criado com sucesso!')
        setCriando(false)
        carregarMeusEventos()
      } else { setErro(json.error || 'Erro ao criar evento.') }
    } catch { setErro('Erro de conexão.') }
    finally { setLoading(false) }
  }

  async function handleEditar(form, arquivoFoto) {
    setLoading(true); setErro(''); setOk('')
    try {
      const fd = montarFormData(form, arquivoFoto, {
        vagas: Number(form.vagas),
        valor: Number(form.valor)
      })

      const res = await fetch(`${API}/eventos/${editando.id_evento}`, { method: 'PUT', body: fd })
      const json = await res.json()
      if (res.ok) {
        setOk('Evento atualizado!')
        setEditando(null)
        carregarMeusEventos()
      } else { setErro(json.error || 'Erro ao editar.') }
    } catch { setErro('Erro de conexão.') }
    finally { setLoading(false) }
  }

  async function handleDeletar(id) {
    if (!confirm('Tem certeza que quer deletar este evento?')) return
    try {
      const res = await fetch(`${API}/eventos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setOk('Evento deletado.')
        carregarMeusEventos()
      } else { setErro('Erro ao deletar.') }
    } catch { setErro('Erro de conexão.') }
  }

  // ─── NÃO LOGADO ───────────────────────────────────────────
  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="ce-nao-logado">
          <div className="ce-nao-logado-box">
            <p className="ce-nao-logado-icone">🔒</p>
            <h2 className="ce-nao-logado-titulo">Acesso restrito</h2>
            <p className="ce-nao-logado-texto">Você precisa estar logado para criar ou gerenciar eventos.</p>
            <a href="/cadastro-login" className="btn-ce-login">Fazer login</a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="ce-page">
        <div className="ce-hero">
          <h1 className="ce-titulo">Meus Eventos</h1>
          <button className="btn-novo-evento" onClick={() => { setCriando(true); setEditando(null) }}>
            + Criar novo evento
          </button>
        </div>

        {erro && <p className="ce-erro">{erro}</p>}
        {ok && <p className="ce-ok">{ok}</p>}

        {criando && (
          <div className="ce-secao">
            <h2 className="ce-secao-titulo">Novo evento</h2>
            <FormEvento onSalvar={handleCriar} onCancelar={() => setCriando(false)} loading={loading} />
          </div>
        )}

        {editando && (
          <div className="ce-secao">
            <h2 className="ce-secao-titulo">Editando: {editando.titulo}</h2>
            <FormEvento inicial={editando} onSalvar={handleEditar} onCancelar={() => setEditando(null)} loading={loading} />
          </div>
        )}

        <div className="ce-secao">
          <h2 className="ce-secao-titulo">Eventos criados por você</h2>
          {meusEventos.length === 0 ? (
            <p className="ce-vazio">Você ainda não criou nenhum evento.</p>
          ) : (
            <div className="ce-lista">
              {meusEventos.map(e => (
                <CardEvento
                  key={e.id_evento}
                  evento={e}
                  onEditar={ev => { setEditando(ev); setCriando(false) }}
                  onDeletar={handleDeletar}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}