import { useState, useEffect, useRef } from 'react'
import './App.css'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  function handleLogout(e) {
    e.preventDefault()
    localStorage.removeItem('userId')
    alert('Logout efetuado!')
    window.location.href = '/'
  }

  return (
    <header className="main-header">
      <nav className="nav-container">
        <a href="/" className="site-logo-link">
          <img src="/assets/pixelate-removebg.png" alt="Pixelate Logo" className="nav-logo" />
        </a>

        <div className="main-nav">
          <a href="/eventos" className="nav-link">EVENTOS</a>
          <a href="/cadastro-login" className="nav-link">CADASTRO</a>
          <a href="/duvidas" className="nav-link">DÚVIDAS</a>
        </div>

        <div className="nav-actions">
          <input type="text" className="search-bar" placeholder="Buscar eventos..." />

          <div className="dropdown-profile" ref={dropdownRef}>
            <a
              href="#"
              className="profile-icon"
              onClick={e => { e.preventDefault(); setDropdownOpen(o => !o) }}
            >
              <img src="/assets/pfp.png.png" alt="Avatar" className="profile-avatar" />
            </a>

            {dropdownOpen && (
              <div className="dropdown-content">
                <a href="/perfil">Perfil</a>
                <a href="#" onClick={handleLogout}>Sair</a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}