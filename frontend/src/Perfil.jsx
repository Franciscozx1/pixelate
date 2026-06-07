import { useState, useEffect } from 'react'
import './Perfil.css'
import { useAuth } from './hooks/useAuth'

const API = 'http://localhost:3000'

export default function Perfil() {
  const { userId, logout } = useAuth()
  const [usuario, setUsuario] = useState(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    if (!userId) { window.location.href = '/cadastro-login'; return }
    fetch(`${API}/usuarios/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUsuario(data)
        setNome(data.nome || '')
        setEmail(data.email || '')
      })
      .catch(() => setErro('Erro ao carregar perfil.'))
  }, [userId])

  async function handleSalvar(e) {
    e.preventDefault()
    setErro(''); setOk('')
    try {
      const body = { nome, email, senhaConfirmacao: senhaAtual }
      if (novaSenha) body.senha = novaSenha

      const res = await fetch(`${API}/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      if (res.ok) {
        setOk('Perfil atualizado com sucesso!')
        localStorage.setItem('userName', nome)
        setSenhaAtual(''); setNovaSenha('')
      } else {
        setErro(json.error || 'Erro ao atualizar.')
      }
    } catch {
      setErro('Erro de conexão com o servidor.')
    }
  }

 

  if (!usuario) return (
    <div className="perfil-page">
      <p className="perfil-loading">Carregando...</p>
    </div>
  )

  return (
    <div className="perfil-page">
      <div className="perfil-box">
        <div className="perfil-header">
          <div className="perfil-avatar-placeholder">
            {usuario.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="perfil-nome">{usuario.nome}</h1>
            <p className="perfil-email">{usuario.email}</p>
          </div>
        </div>

        <form className="perfil-form" onSubmit={handleSalvar}>
          <h2 className="perfil-secao">Editar perfil</h2>

          <label className="perfil-label">Nome</label>
          <input
            className="perfil-input"
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />

          <label className="perfil-label">E-mail</label>
          <input
            className="perfil-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <h2 className="perfil-secao">Alterar senha</h2>

          <label className="perfil-label">Senha atual <span className="perfil-obrig">*obrigatório para salvar</span></label>
          <input
            className="perfil-input"
            type="password"
            placeholder="••••••••"
            value={senhaAtual}
            onChange={e => setSenhaAtual(e.target.value)}
            required
          />

          <label className="perfil-label">Nova senha <span className="perfil-opcional">(opcional)</span></label>
          <input
            className="perfil-input"
            type="password"
            placeholder="••••••••"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
          />

          {erro && <p className="perfil-erro">{erro}</p>}
          {ok  && <p className="perfil-ok">{ok}</p>}

          <button className="btn-salvar" type="submit">Salvar alterações</button>
        </form>

        <button className="btn-logout" onClick={logout}>Sair da conta</button>
      </div>
    </div>
  )
}
