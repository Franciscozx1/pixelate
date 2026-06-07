import { useState, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './Navbar'

const API = 'http://localhost:3000'

// ─── HERO ─────────────────────────────────────────────────
function Hero() {
  return (
    <main className="hero-section">
      <p className="chapter-info">Encontre ou crie seu próprio evento</p>
      <a href="/eventos" className="btn-explore">Explorar Eventos</a>
    </main>
  )
}

// ─── CARROSSEL ────────────────────────────────────────────
function Carousel() {
  const [eventos, setEventos] = useState([])
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    async function carregarDestaques() {
      try {
        const res = await fetch(`${API}/eventos/destaques`)
        const data = await res.json()
        if (data && data.length > 0) {
          setEventos(data.slice(0, 3))
        }
      } catch (err) {
        console.error('Erro ao carregar carrossel:', err)
      }
    }
    carregarDestaques()
  }, [])

  useEffect(() => {
    if (eventos.length === 0) return
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % eventos.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [eventos])

  function mover(direcao) {
    clearInterval(intervalRef.current)
    setIndex(i => (i + direcao + eventos.length) % eventos.length)
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % eventos.length)
    }, 5000)
  }

  function formatarData(data) {
    if (!data) return 'A definir'
    const p = data.split('T')[0].split('-')
    return `${p[2]}/${p[1]}/${p[0]}`
  }

  if (eventos.length === 0) return null

  const evento = eventos[index]
  
  // 🛠️ O PULO DO GATO: Juntamos a URL da API com o caminho da imagem salvo no banco
  const imagemUrl = evento.imagem ? `${API}${evento.imagem}` : '/assets/pixelate.jpg'

  return (
    <section className="featured-events">
      <h3 className="section-title">Eventos em Destaque</h3>

      <div className="carousel-container">
        <button className="carousel-btn left-btn" onClick={() => mover(-1)}>❮</button>

        <div className="carousel-viewport">
          <div
            className="event-card"
            style={{ backgroundImage: `url('${imagemUrl}')` }}
          >
            <div className="card-info">
              <h4>{evento.titulo || 'Nome do Evento'}</h4>
              <p>{evento.descricao || 'Participe deste evento incrível na plataforma Pixelate!'}</p>
              <div className="card-footer">
                <span>Data: {formatarData(evento.data_evento)}</span>
                <span>Local: {evento.local || 'A definir'}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="carousel-btn right-btn" onClick={() => mover(1)}>❯</button>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="main-footer">
      <p>© 2026 Pixelate. Todos os direitos reservados.</p>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Carousel />
      <Footer />
    </>
  )
}