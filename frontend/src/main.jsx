import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import NotFound from './NotFound'
import './index.css'
import Eventos from './Eventos'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)