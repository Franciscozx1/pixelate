import { useState } from 'react'
import './CadastroLogin.css'

const API = 'http://localhost:3000'

export default function CadastroLogin() {
  const [aba, setAba] = useState('login')

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const [loginErro, setLoginErro] = useState('')

  // Registro
  const [regNome, setRegNome] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regSenha, setRegSenha] = useState('')
  const [regErro, setRegErro] = useState('')
  const [regOk, setRegOk] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoginErro('')
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, senha: loginSenha })
      })
      const json = await res.json()
      if (res.ok) {
        localStorage.setItem('userId', json.usuario.id_usuario)
        localStorage.setItem('userName', json.usuario.nome)
        window.location.href = '/'
      } else {
        setLoginErro(json.error || 'Erro ao fazer login.')
      }
    } catch {
      setLoginErro('Erro de conexão com o servidor.')
    }
  }

  async function handleRegistro(e) {
    e.preventDefault()
    setRegErro('')
    setRegOk('')
    try {
      const res = await fetch(`${API}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: regNome, email: regEmail, senha: regSenha })
      })
      const json = await res.json()
      if (res.ok) {
        setRegOk('Conta criada com sucesso! Faça login.')
        setRegNome(''); setRegEmail(''); setRegSenha('')
        setTimeout(() => setAba('login'), 1500)
      } else {
        setRegErro(json.error || 'Erro ao criar conta.')
      }
    } catch {
      setRegErro('Erro de conexão com o servidor.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <a href="/">
          <img src="/assets/pixelate-nav.png" alt="Pixelate" className="auth-logo" />
        </a>
        

        <div className="auth-tabs">
          <button
            className={`auth-tab ${aba === 'login' ? 'ativa' : ''}`}
            onClick={() => setAba('login')}
          >Login</button>
          <button
            className={`auth-tab ${aba === 'registro' ? 'ativa' : ''}`}
            onClick={() => setAba('registro')}
          >Cadastro</button>
        </div>

        {aba === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label className="auth-label">E-mail</label>
            <input
              className="auth-input"
              type="email"
              placeholder="seu@email.com"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
            />
            <label className="auth-label">Senha</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={loginSenha}
              onChange={e => setLoginSenha(e.target.value)}
              required
            />
            {loginErro && <p className="auth-erro">{loginErro}</p>}
            <button className="btn-auth" type="submit">Entrar</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegistro}>
            <label className="auth-label">Nome</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Seu nome"
              value={regNome}
              onChange={e => setRegNome(e.target.value)}
              required
            />
            <label className="auth-label">E-mail</label>
            <input
              className="auth-input"
              type="email"
              placeholder="seu@email.com"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              required
            />
            <label className="auth-label">Senha</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={regSenha}
              onChange={e => setRegSenha(e.target.value)}
              required
            />
            {regErro && <p className="auth-erro">{regErro}</p>}
            {regOk  && <p className="auth-ok">{regOk}</p>}
            <button className="btn-auth" type="submit">Criar conta</button>
          </form>
        )}
      </div>
    </div>
  )
}
