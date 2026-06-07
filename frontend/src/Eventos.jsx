import { useState, useEffect, useRef } from 'react'
import './Eventos.css'
import Navbar from './Navbar'

const API = 'http://localhost:3000'

// ─── ESTRELAS ─────────────────────────────────────────────
function Estrelas({ nota, tamanho = 16 }) {
  return (
    <span className="estrelas" style={{ fontSize: tamanho }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(nota) ? '#FF8C00' : '#3B3B6B' }}>★</span>
      ))}
    </span>
  )
}

// ─── MODAL ────────────────────────────────────────────────
function EventoModal({ evento, onClose }) {
  const [media, setMedia] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [inscrito, setInscrito] = useState(false)
  const [loadingInscricao, setLoadingInscricao] = useState(false)
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviandoAval, setEnviandoAval] = useState(false)
  const userId = localStorage.getItem('userId')
  const modalRef = useRef(null)

  useEffect(() => {
    async function carregar() {
      try {
        const [resMedia, resAval] = await Promise.all([
          fetch(`${API}/avaliacoes/evento/${evento.id_evento}/media`),
          fetch(`${API}/avaliacoes/evento/${evento.id_evento}`)
        ])
        const dataMedia = await resMedia.json()
        const dataAval = await resAval.json()
        setMedia(dataMedia)
        setAvaliacoes(dataAval)
      } catch (err) {
        console.error(err)
      }
    }
    carregar()
  }, [evento.id_evento])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function formatarData(data) {
    if (!data) return 'A definir'
    const p = data.split('T')[0].split('-')
    return `${p[2]}/${p[1]}/${p[0]}`
  }

  async function handleInscrever() {
    if (!userId) return
    setLoadingInscricao(true)
    try {
      const res = await fetch(`${API}/inscricoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, id_evento: evento.id_evento })
      })
      const json = await res.json()
      if (res.ok) {
        setInscrito(true)
        alert('Inscrição realizada com sucesso!')
      } else {
        alert(json.error || 'Erro ao se inscrever.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInscricao(false)
    }
  }

  async function handleAvaliar(e) {
    e.preventDefault()
    if (!userId || nota === 0) return
    setEnviandoAval(true)
    try {
      const res = await fetch(`${API}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: Number(userId),
          id_evento: evento.id_evento,
          nota,
          comentario
        })
      })
      const json = await res.json()
      if (res.ok) {
        alert('Avaliação enviada!')
        setNota(0)
        setComentario('')
        // Recarrega avaliações e média
        const [resMedia, resAval] = await Promise.all([
          fetch(`${API}/avaliacoes/evento/${evento.id_evento}/media`),
          fetch(`${API}/avaliacoes/evento/${evento.id_evento}`)
        ])
        setMedia(await resMedia.json())
        setAvaliacoes(await resAval.json())
      } else {
        alert(json.error || 'Erro ao avaliar.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setEnviandoAval(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === modalRef.current && onClose()} ref={modalRef}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Imagem */}
        <div
          className="modal-imagem"
          style={{ backgroundImage: `url('${evento.imagem || '/assets/pixelate.jpg'}')` }}
        />

        {/* Conteúdo */}
        <div className="modal-body">
          <div className="modal-header-info">
            <div>
              {evento.categoria && <span className="card-tag">{evento.categoria}</span>}
              <h2 className="modal-titulo">{evento.titulo}</h2>
            </div>
            {media && media.total > 0 && (
              <div className="modal-media">
                <Estrelas nota={media.media} tamanho={18} />
                <span className="modal-media-num">{media.media} <span className="modal-media-total">({media.total})</span></span>
              </div>
            )}
          </div>

          <div className="modal-meta">
            <span>📅 {formatarData(evento.data_evento)}{evento.hora_evento ? ` · ${evento.hora_evento}` : ''}</span>
            <span>📍 {evento.local || 'A definir'}</span>
            {evento.valor != null && <span>💰 R$ {Number(evento.valor).toFixed(2)}</span>}
            {evento.vagas != null && <span>🎟 {evento.vagas} vagas</span>}
          </div>

          {evento.descricao && (
            <p className="modal-descricao">{evento.descricao}</p>
          )}

          {/* Inscrição */}
          <div className="modal-inscricao">
            {userId ? (
              <button
                className="btn-inscrever"
                onClick={handleInscrever}
                disabled={inscrito || loadingInscricao}
              >
                {inscrito ? 'Inscrito ✓' : loadingInscricao ? 'Aguarde...' : 'Inscrever-se'}
              </button>
            ) : (
              <p className="modal-login-aviso">É necessário fazer login para se inscrever.</p>
            )}
          </div>

          {/* Avaliações */}
          <div className="modal-avaliacoes">
            <h3 className="modal-aval-titulo">Avaliações</h3>

            {avaliacoes.length === 0 ? (
              <p className="modal-aval-vazio">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="aval-lista">
                {avaliacoes.map((a, i) => (
                  <div key={i} className="aval-item">
                    <div className="aval-topo">
                      <Estrelas nota={a.nota} tamanho={14} />
                      <span className="aval-data">
                        {new Date(a.data_avaliacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {a.comentario && <p className="aval-comentario">{a.comentario}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Form de avaliação — só se logado */}
            {userId && (
              <form className="aval-form" onSubmit={handleAvaliar}>
                <p className="aval-form-label">Sua avaliação</p>
                <div className="aval-estrelas-select">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`aval-estrela-btn ${n <= nota ? 'ativa' : ''}`}
                      onClick={() => setNota(n)}
                    >★</button>
                  ))}
                </div>
                <textarea
                  className="aval-textarea"
                  placeholder="Comentário (opcional)"
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  rows={3}
                />
                <button
                  type="submit"
                  className="btn-avaliar"
                  disabled={nota === 0 || enviandoAval}
                >
                  {enviandoAval ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────
function EventoCard({ evento, onClick }) {
  const [media, setMedia] = useState(null)

  useEffect(() => {
    fetch(`${API}/avaliacoes/evento/${evento.id_evento}/media`)
      .then(r => r.json())
      .then(setMedia)
      .catch(() => {})
  }, [evento.id_evento])

  function formatarData(data) {
    if (!data) return 'A definir'
    const p = data.split('T')[0].split('-')
    return `${p[2]}/${p[1]}/${p[0]}`
  }

  return (
    <div className="evento-card" onClick={onClick}>
      <div
        className="evento-card-img"
        style={{ backgroundImage: `url('${evento.imagem || '/assets/pixelate.jpg'}')` }}
      >
        {evento.categoria && <span className="card-tag">{evento.categoria}</span>}
      </div>
      <div className="evento-card-body">
        <h3 className="evento-card-titulo">{evento.titulo}</h3>
        <div className="evento-card-meta">
          <span>📅 {formatarData(evento.data_evento)}</span>
          <span>📍 {evento.local || 'A definir'}</span>
        </div>
        {media && media.total > 0 && (
          <div className="evento-card-aval">
            <Estrelas nota={media.media} tamanho={14} />
            <span className="evento-card-aval-num">{media.media} ({media.total})</span>
          </div>
        )}
        <button className="btn-ver-mais">Ver mais →</button>
      </div>
    </div>
  )
}

// ─── PÁGINA ───────────────────────────────────────────────
export default function Eventos() {
  const [eventos, setEventos] = useState([])
  const [busca, setBusca] = useState('')
  const [eventoSelecionado, setEventoSelecionado] = useState(null)

  useEffect(() => {
    fetch(`${API}/eventos`)
      .then(r => r.json())
      .then(setEventos)
      .catch(err => console.error(err))
  }, [])

  const eventosFiltrados = eventos.filter(e => {
    const q = busca.toLowerCase()
    return (
      e.titulo?.toLowerCase().includes(q) ||
      e.categoria?.toLowerCase().includes(q) ||
      e.local?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="eventos-page">
        <Navbar />
      <div className='div-nav-container'>

      </div>
      {/* Hero */}
      <div className="eventos-hero">
        <h1 className="eventos-hero-titulo">Eventos</h1>
        <div className="eventos-hero-acoes">
          <input
            type="text"
            className="eventos-busca"
            placeholder="Buscar por nome, categoria ou local..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <a href="/criar-evento" className="btn-criar-evento">+ Criar evento</a>
        </div>
      </div>

      {/* Grid */}
      <div className="eventos-grid">
        {eventosFiltrados.length === 0 ? (
          <p className="eventos-vazio">Nenhum evento encontrado.</p>
        ) : (
          eventosFiltrados.map(evento => (
            <EventoCard
              key={evento.id_evento}
              evento={evento}
              onClick={() => setEventoSelecionado(evento)}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {eventoSelecionado && (
        <EventoModal
          evento={eventoSelecionado}
          onClose={() => setEventoSelecionado(null)}
        />
      )}
    </div>
  )
}
