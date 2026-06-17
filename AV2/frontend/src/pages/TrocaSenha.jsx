import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import SenhaInput from '../components/SenhaInput';
import AlertaBox  from '../components/AlertaBox';
import { apiTrocarSenha } from '../services/api';
import {
  validarEmail,
  validarSenha,
  avaliarForcaSenha,
  INSTRUCAO_SENHA,
} from '../services/validacoes';

export default function TrocaSenha() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [loginVal,    setLoginVal]    = useState('');
  const [senhaAtual,  setSenhaAtual]  = useState('');
  const [novaSenha,   setNovaSenha]   = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erros,       setErros]       = useState({});
  const [alerta,      setAlerta]      = useState({ msg: '', tipo: 'erro' });
  const [loading,     setLoading]     = useState(false);

  const forca = avaliarForcaSenha(novaSenha);

  // ── Validação local ─────────────────────────────────────────
  function validar() {
    const novosErros = {};

    if (!loginVal.trim()) {
      novosErros.login = 'O campo de e-mail (login) deve ser preenchido.';
    } else if (!validarEmail(loginVal)) {
      novosErros.login = 'Informe um e-mail válido. Ex: usuario@dominio.com';
    }

    if (!senhaAtual) {
      novosErros.senhaAtual = 'A senha atual deve ser preenchida.';
    }

    if (!novaSenha) {
      novosErros.novaSenha = 'A nova senha deve ser preenchida.';
    } else {
      const res = validarSenha(novaSenha);
      if (!res.valido) novosErros.novaSenha = res.mensagem;
    }

    if (!confirmaSenha) {
      novosErros.confirmaSenha = 'A confirmação de senha deve ser preenchida.';
    } else if (novaSenha && confirmaSenha !== novaSenha) {
      novosErros.confirmaSenha = 'A confirmação de senha não coincide com a nova senha.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleTrocar() {
    setAlerta({ msg: '', tipo: 'erro' });
    if (!validar()) {
      setAlerta({ msg: 'Por favor, corrija os erros indicados.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await apiTrocarSenha(loginVal.trim(), senhaAtual, novaSenha);
      if (resultado.ok) {
        setAlerta({ msg: '✅ Validação realizada com sucesso! Senha alterada com sucesso.', tipo: 'sucesso' });
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao trocar senha. Verifique seus dados.', tipo: 'erro' });
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setLoginVal('');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmaSenha('');
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-main">
        <section className="form-wrapper troca-senha" aria-label="Formulário de troca de senha">
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Troca de Senha de Clientes</h1>

          <div className="info-banner">
            ℹ️ Preencha seu e-mail, a senha atual e a nova senha abaixo para realizar a troca.
          </div>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          <div className="form-group">
            <label htmlFor="ts-login">E-mail (Login)</label>
            <input
              type="email"
              id="ts-login"
              value={loginVal}
              onChange={e => setLoginVal(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="username"
              maxLength={120}
              className={erros.login ? 'campo-erro' : ''}
            />
            {erros.login && <span className="msg-erro">{erros.login}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ts-senha-atual">Senha Atual</label>
            <SenhaInput
              id="ts-senha-atual"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              placeholder="Sua senha atual"
              autoComplete="current-password"
              erro={erros.senhaAtual}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ts-nova-senha">Nova Senha</label>
            <SenhaInput
              id="ts-nova-senha"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              erro={erros.novaSenha}
            />
            {forca && (
              <span className={`forca-senha ${forca.classe}`}>{forca.texto}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ts-confirma">Confirmar Nova Senha</label>
            <SenhaInput
              id="ts-confirma"
              value={confirmaSenha}
              onChange={e => setConfirmaSenha(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              erro={erros.confirmaSenha}
            />
          </div>

          <div className="form-group">
            <h4 style={{ color: 'var(--brand-dark)', marginBottom: '.5rem', fontSize: '.92rem' }}>
              📋 Regras de composição da senha
            </h4>
            <textarea
              className="instrucao-senha"
              readOnly
              value={INSTRUCAO_SENHA}
              aria-label="Instruções sobre regras da senha"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleTrocar}
              disabled={loading}>
              {loading ? '⏳ Salvando...' : '🔒 Trocar Senha'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}>
              🗑️ Limpar
            </button>
          </div>

          <div className="auth-links" style={{ marginTop: '1.25rem' }}>
            <Link to="/login">← Voltar ao Login</Link>
            &nbsp;·&nbsp;
            <Link to="/">Página Inicial</Link>
          </div>
        </section>
      </main>
    </div>
  );
}