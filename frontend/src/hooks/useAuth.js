import { useState, useEffect } from 'react'

export function useAuth() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'))
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'))

  useEffect(() => {
    // Re-lê se o storage mudar em outra aba ou após login
    function sync() {
      setUserId(localStorage.getItem('userId'))
      setUserName(localStorage.getItem('userName'))
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function logout() {
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    setUserId(null)
    setUserName(null)
    window.location.href = '/'
  }

  return { userId, userName, logout }
}
