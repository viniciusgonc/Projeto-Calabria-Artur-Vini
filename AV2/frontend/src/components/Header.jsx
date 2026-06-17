import { Link, useNavigate } from 'react-router-dom';
import { Session } from '../services/session';

export default function Header() {
  const navigate = useNavigate();
  const logado   = Session.estaLogado();

  function handleLogout() {
    Session.limpar();
    navigate('/');
  }

  return (
    <>
      <header className="main-header">
        <nav>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo-area">
              <span className="logo-text">ArtWinners <strong>TI</strong></span>
              <span className="logo-slogan">A arte que te faz vencer no mercado</span>
            </div>
          </Link>

          <ul className="nav-links">
            {!logado && (
              <>
                <li>
                  <Link to="/login" className="nav-link">🔐 Login</Link>
                </li>
                <li>
                  <Link to="/cadastro" className="nav-link">📝 Cadastrar-se</Link>
                </li>
              </>
            )}

            {logado && (
              <>
                <li>
                  <Link to="/servicos" className="nav-link nav-link-destaque">💼 Meus Serviços</Link>
                </li>
                <li>
                  <button
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    🚪 Encerrar sessão
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <div className="header-gradient-bar"></div>
    </>
  );
}