import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import SenhaInput from '../components/SenhaInput';
import AlertaBox  from '../components/AlertaBox';
import { apiLogin } from '../services/api';
import { Session }  from '../services/session';
import { validarEmail } from '../services/validacoes';

export default function Login() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [loginVal,  setLoginVal]  = useState('');
  const [senhaVal,  setSenhaVal]  = useState('');
  const [erros,     setErros]     = useState({});
  const [alerta,    setAlerta]    = useState({ msg: '', tipo: 'erro' });
  const [loading,   setLoading]   = useState(false);

  // ── Validação local ─────────────────────────────────────────
  function validar() {
    const novosErros = {};

    if (!loginVal.trim()) {
      novosErros.login = 'O campo de e-mail (login) deve ser preenchido.';
    } else if (!validarEmail(loginVal)) {
      novosErros.login = 'O e-mail informado não tem formato válido. Ex: usuario@dominio.com';
    }

    if (!senhaVal) {
      novosErros.senha = 'A senha deve ser preenchida.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleLogin() {
    setAlerta({ msg: '', tipo: 'erro' });
    if (!validar()) {
      setAlerta({ msg: 'Por favor, corrija os erros indicados abaixo.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await apiLogin(loginVal.trim(), senhaVal);
      if (resultado.ok) {
        Session.salvar(loginVal.trim(), loginVal.trim());
        alert('Validação realizada com sucesso! Bem-vindo(a)!');
        navigate('/servicos');
      } else {
        setAlerta({ msg: resultado.erro || 'E-mail ou senha incorretos. Verifique seus dados.', tipo: 'erro' });
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setLoginVal('');
    setSenhaVal('');
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-main">
        <section className="form-wrapper" aria-label="Formulário de login">
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Login de Clientes</h1>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          <div className="form-group">
            <label htmlFor="input-login">E-mail (Login)</label>
            <input
              type="email"
              id="input-login"
              value={loginVal}
              onChange={e => setLoginVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="seu@email.com"
              autoComplete="username"
              maxLength={120}
              className={erros.login ? 'campo-erro' : ''}
            />
            {erros.login && <span className="msg-erro">{erros.login}</span>}
          </div>

          <Link to="/troca-senha" style={{ fontSize: '.85rem', color: 'var(--ink-light)', display: 'block', textAlign: 'right', marginTop: '-.5rem', marginBottom: '.75rem' }}>
            Esqueceu sua senha?
          </Link>

          <div className="form-group">
            <label htmlFor="input-senha">Senha</label>
            <SenhaInput
              id="input-senha"
              value={senhaVal}
              onChange={e => setSenhaVal(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              erro={erros.senha}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
              disabled={loading}>
              {loading ? '⏳ Entrando...' : '🔐 Realizar Login'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}>
              🗑️ Limpar
            </button>
          </div>

          <div className="divider">ou</div>

          <div className="auth-links">
            Não tem conta? <Link to="/cadastro">Cadastrar-se agora</Link>
            &nbsp;·&nbsp;
            <Link to="/">← Voltar à Home</Link>
          </div>
        </section>
      </main>
    </div>
  );
}