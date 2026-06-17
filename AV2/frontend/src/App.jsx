import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Servicos from './pages/Servicos'
import CadastroServico from './pages/CadastroServico'
import TrocaSenha from './pages/TrocaSenha'

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/cadastro-servico" element={<CadastroServico />} />
            <Route path="/troca-senha" element={<TrocaSenha />} />

            {/* rota fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App