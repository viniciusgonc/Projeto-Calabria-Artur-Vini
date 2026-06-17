import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import SenhaInput from '../components/SenhaInput';
import AlertaBox  from '../components/AlertaBox';
import { apiTrocarSenha } from '../services/api';
import { validarEmail } from '../services/validacoes'; // Ajuste para '../services/validacoes' se necessário

export default function TrocaSenha() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    login: '',
    senhaAtual: '',
    novaSenha: '',
    confirmaSenha: ''
  });

  const [erros, setErros] = useState({});
  const [alerta, setAlerta] = useState({ msg: '', tipo: 'erro' });
  const [loading, setLoading] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────
  function handleChange(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  // ── Validação local ─────────────────────────────────────────
  function validar() {
    const novosErros = {};

    if (!form.login.trim()) {
      novosErros.login = 'O e-mail é obrigatório.';
    } else if (!validarEmail(form.login)) {
      novosErros.login = 'O e-mail informado não é válido.';
    }

    if (!form.senhaAtual) {
      novosErros.senhaAtual = 'A senha atual é obrigatória.';
    }

    if (!form.novaSenha) {
      novosErros.novaSenha = 'A nova senha é obrigatória.';
    } else if (form.novaSenha.length < 6) {
      novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres.';
    }

    if (form.novaSenha !== form.confirmaSenha) {
      novosErros.confirmaSenha = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleTroca() {
    setAlerta({ msg: '', tipo: 'erro' });
    if (!validar()) {
      setAlerta({ msg: 'Por favor, corrija os erros indicados abaixo.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await apiTrocarSenha(form.login.trim(), form.senhaAtual, form.novaSenha);
      
      if (resultado.ok) {
        alert('Senha alterada com sucesso! Faça login com a sua nova senha.');
        navigate('/login');
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao tentar trocar a senha. Verifique os seus dados.', tipo: 'erro' });
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor backend está a correr.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setForm({ login: '', senhaAtual: '', novaSenha: '', confirmaSenha: '' });
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-main">
        <section className="form-wrapper" aria-label="Formulário de Troca de Senha" style={{ maxWidth: '450px' }}>
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Alterar Senha</h1>
          <p style={{ textAlign: 'center', color: 'var(--ink-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Informe a sua senha atual e a nova senha desejada.
          </p>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          <div className="form-group">
            <label htmlFor="ts-login">E-mail (Login) *</label>
            <input
              type="email"
              id="ts-login"
              value={form.login}
              onChange={e => handleChange('login', e.target.value)}
              placeholder="seu@email.com"
              autoComplete="username"
              className={erros.login ? 'campo-erro' : ''}
            />
            {erros.login && <span className="msg-erro">{erros.login}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ts-senha-atual">Senha Atual *</label>
            <SenhaInput
              id="ts-senha-atual"
              value={form.senhaAtual}
              onChange={e => handleChange('senhaAtual', e.target.value)}
              placeholder="Digite a senha atual"
              autoComplete="current-password"
              erro={erros.senhaAtual}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ts-nova-senha">Nova Senha *</label>
            <SenhaInput
              id="ts-nova-senha"
              value={form.novaSenha}
              onChange={e => handleChange('novaSenha', e.target.value)}
              placeholder="Crie uma nova senha"
              autoComplete="new-password"
              erro={erros.novaSenha}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ts-confirma-senha">Confirmar Nova Senha *</label>
            <SenhaInput
              id="ts-confirma-senha"
              value={form.confirmaSenha}
              onChange={e => handleChange('confirmaSenha', e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              erro={erros.confirmaSenha}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleTroca}
              disabled={loading}>
              {loading ? '⏳ A processar...' : '🔄 Alterar Senha'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}>
              🗑️ Limpar
            </button>
          </div>

          <div className="divider">ou</div>

          <div className="auth-links" style={{ textAlign: 'center' }}>
            Lembrou da senha? <Link to="/login">Faça Login</Link>
            <br /><br />
            <Link to="/">← Voltar à Home</Link>
          </div>
        </section>
      </main>
    </div>
  );
}