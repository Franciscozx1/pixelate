import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import NotFound from './NotFound'
import './index.css'
import Eventos from './Eventos'
import CadastroLogin from './CadastroLogin'
import Perfil from './Perfil'
import Duvidas from './Duvidas'
import CriarEvento from './CriarEvento'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/criar-evento" element={<CriarEvento />} />
      <Route path="/cadastro-login" element={<CadastroLogin />} />
      <Route path="/duvidas" element={<Duvidas />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)