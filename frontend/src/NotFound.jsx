import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-title">Página não encontrada</p>
        <p className="not-found-sub">
          O evento que você procura não existe ou foi removido.
        </p>
        <a href="/" className="btn-voltar">Voltar ao início</a>
      </div>
    </div>
  )
}
