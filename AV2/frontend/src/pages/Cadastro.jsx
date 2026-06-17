import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import SenhaInput from '../components/SenhaInput';
import AlertaBox  from '../components/AlertaBox';
import { apiCadastrarCliente } from '../services/api';
import {
  validarEmail,
  validarSenha,
  validarNome,
  validarCPF,
  validarMaioridade,
  validarTelefone,
  avaliarForcaSenha,
  mascaraCPF,
  dataMaxHoje,
  INSTRUCAO_SENHA,
} from '../services/validacoes';

const ESCOLARIDADE_OPCOES = [
  { value: '1g_inc',  label: '1º Grau Incompleto' },
  { value: '1g_comp', label: '1º Grau Completo' },
  { value: '2g_comp', label: '2º Grau Completo' },
  { value: 'sup',     label: 'Nível Superior' },
  { value: 'pos',     label: 'Pós-Graduado' },
];

export default function Cadastro() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    email:       '',
    senha:       '',
    confirma:    '',
    nome:        '',
    cpf:         '',
    nascimento:  '',
    telefone:    '',
    estadoCivil: 'solteiro',
    escolaridade:'2g_comp',
  });
  const [erros,   setErros]   = useState({});
  const [alerta,  setAlerta]  = useState({ msg: '', tipo: 'erro' });
  const [loading, setLoading] = useState(false);

  const forca = avaliarForcaSenha(form.senha);

  // ── Helpers ─────────────────────────────────────────────────
  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  function handleCPF(e) {
    set('cpf', mascaraCPF(e.target.value));
  }

  // ── Validação local ─────────────────────────────────────────
  function validar() {
    const e = {};

    if (!form.email.trim()) {
      e.email = 'O e-mail deve ser preenchido.';
    } else if (!validarEmail(form.email)) {
      e.email = 'Informe um e-mail válido. Ex: usuario@dominio.com';
    }

    if (!form.senha) {
      e.senha = 'A senha deve ser preenchida.';
    } else {
      const r = validarSenha(form.senha);
      if (!r.valido) e.senha = r.mensagem;
    }

    if (!form.confirma) {
      e.confirma = 'A confirmação de senha deve ser preenchida.';
    } else if (form.confirma !== form.senha) {
      e.confirma = 'A confirmação não coincide com a senha digitada.';
    }

    const rNome = validarNome(form.nome);
    if (!rNome.valido) e.nome = rNome.mensagem;

    if (!form.cpf.trim()) {
      e.cpf = 'O CPF deve ser preenchido.';
    } else if (!validarCPF(form.cpf)) {
      e.cpf = 'CPF inválido. Verifique os dígitos informados.';
    }

    if (!form.nascimento) {
      e.nascimento = 'A data de nascimento deve ser preenchida.';
    } else if (!validarMaioridade(form.nascimento)) {
      e.nascimento = 'O cliente deve ter pelo menos 18 anos de idade.';
    }

    if (form.telefone && !validarTelefone(form.telefone)) {
      e.telefone = 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos).';
    }

    setErros(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleIncluir() {
    setAlerta({ msg: '', tipo: 'erro' });
    if (!validar()) {
      setAlerta({ msg: 'Por favor, corrija os erros indicados no formulário.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await apiCadastrarCliente({
        login:       form.email.trim(),
        senha:       form.senha,
        nome:        form.nome.trim(),
        cpf:         form.cpf.trim(),
        nascimento:  form.nascimento,
        telefone:    form.telefone.trim(),
        estado_civil: form.estadoCivil,
        escolaridade: form.escolaridade,
      });

      if (resultado.ok) {
        alert('Validação realizada com sucesso! Cadastro realizado. Faça seu login.');
        navigate('/login');
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao realizar o cadastro.', tipo: 'erro' });
        if (resultado.erro?.includes('e-mail')) {
          setErros(e => ({ ...e, email: resultado.erro }));
        }
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setForm({ email: '', senha: '', confirma: '', nome: '', cpf: '', nascimento: '', telefone: '', estadoCivil: 'solteiro', escolaridade: '2g_comp' });
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-main" style={{ alignItems: 'flex-start', padding: '2rem 1rem' }}>
        <section className="form-wrapper cadastro-wrapper" aria-label="Formulário de cadastro de clientes">
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Cadastro de Clientes</h1>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          {/* ── Dados de Acesso ── */}
          <h2 className="cadastro-secao">🔐 Dados de Acesso</h2>

          <div className="form-group">
            <label htmlFor="cad-email">
              E-mail (será o seu Login) <strong style={{ color: '#c53030' }}>*</strong>
            </label>
            <input
              type="email"
              id="cad-email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="seu@email.com"
              autoComplete="off"
              maxLength={120}
              className={erros.email ? 'campo-erro' : ''}
            />
            {erros.email && <span className="msg-erro">{erros.email}</span>}
          </div>

          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="cad-senha">
                Senha <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <SenhaInput
                id="cad-senha"
                value={form.senha}
                onChange={e => set('senha', e.target.value)}
                placeholder="Mín. 6 caracteres"
                autoComplete="new-password"
                erro={erros.senha}
              />
              {forca && <span className={`forca-senha ${forca.classe}`}>{forca.texto}</span>}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="cad-confirma">
                Confirmar Senha <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <SenhaInput
                id="cad-confirma"
                value={form.confirma}
                onChange={e => set('confirma', e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
                erro={erros.confirma}
              />
            </div>
          </div>

          <div className="form-group">
            <label>📋 Regras de composição da senha:</label>
            <textarea
              className="instrucao-senha"
              readOnly
              value={INSTRUCAO_SENHA}
              style={{ background: '#f0fff8', border: '1px solid rgba(0,187,119,.3)', fontFamily: 'Courier New, monospace', fontSize: '.82rem' }}
            />
          </div>

          {/* ── Dados Pessoais ── */}
          <h2 className="cadastro-secao">👤 Dados Pessoais</h2>

          <div className="form-group">
            <label htmlFor="cad-nome">
              Nome Completo <strong style={{ color: '#c53030' }}>*</strong>
            </label>
            <input
              type="text"
              id="cad-nome"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Ex: Maria Souza"
              maxLength={100}
              className={erros.nome ? 'campo-erro' : ''}
            />
            {erros.nome && <span className="msg-erro">{erros.nome}</span>}
            <span className="aviso-campo">Mínimo 2 palavras. Primeira palavra com pelo menos 2 letras. Sem caracteres especiais.</span>
          </div>

          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="cad-cpf">
                CPF <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <input
                type="text"
                id="cad-cpf"
                value={form.cpf}
                onChange={handleCPF}
                placeholder="000.000.000-00"
                maxLength={14}
                inputMode="numeric"
                autoComplete="off"
                className={erros.cpf ? 'campo-erro' : ''}
                style={{ fontFamily: 'Courier New, monospace', letterSpacing: '1px' }}
              />
              {erros.cpf && <span className="msg-erro">{erros.cpf}</span>}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="cad-nascimento">
                Data de Nascimento <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <input
                type="date"
                id="cad-nascimento"
                value={form.nascimento}
                onChange={e => set('nascimento', e.target.value)}
                max={dataMaxHoje()}
                autoComplete="off"
                className={erros.nascimento ? 'campo-erro' : ''}
              />
              {erros.nascimento && <span className="msg-erro">{erros.nascimento}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cad-telefone">
              Celular / WhatsApp <span style={{ color: 'var(--ink-light)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="tel"
              id="cad-telefone"
              value={form.telefone}
              onChange={e => set('telefone', e.target.value)}
              placeholder="(81) 99999-9999"
              maxLength={20}
              autoComplete="off"
              className={erros.telefone ? 'campo-erro' : ''}
            />
            {erros.telefone && <span className="msg-erro">{erros.telefone}</span>}
            <span className="aviso-campo">Se preenchido, deve ter formato de telefone nacional (DDD + número).</span>
          </div>

          {/* ── Informações Adicionais ── */}
          <h2 className="cadastro-secao">📋 Informações Adicionais</h2>

          <div className="form-group">
            <label>Estado Civil <strong style={{ color: '#c53030' }}>*</strong></label>
            <div className="radio-group" role="group" aria-label="Estado civil">
              {[
                { value: 'solteiro',   label: 'Solteiro(a)' },
                { value: 'casado',     label: 'Casado(a)' },
                { value: 'divorciado', label: 'Divorciado(a)' },
                { value: 'viuvo',      label: 'Viúvo(a)' },
              ].map(op => (
                <label key={op.value}>
                  <input
                    type="radio"
                    name="estado-civil"
                    value={op.value}
                    checked={form.estadoCivil === op.value}
                    onChange={() => set('estadoCivil', op.value)}
                  />
                  {' '}{op.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cad-escolaridade">
              Escolaridade <strong style={{ color: '#c53030' }}>*</strong>
            </label>
            <select
              id="cad-escolaridade"
              value={form.escolaridade}
              onChange={e => set('escolaridade', e.target.value)}>
              {ESCOLARIDADE_OPCOES.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleIncluir}
              disabled={loading}>
              {loading ? '⏳ Cadastrando...' : '✅ Incluir'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}>
              🗑️ Limpar
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}>
              ← Voltar
            </button>
          </div>

          <p style={{ fontSize: '.78rem', color: 'var(--ink-light)', marginTop: '.75rem' }}>
            <strong style={{ color: '#c53030' }}>*</strong> Campos obrigatórios
          </p>

          <div className="auth-links" style={{ marginTop: '1rem' }}>
            Já tem conta? <Link to="/login">Fazer Login</Link>
            &nbsp;·&nbsp;
            <Link to="/">← Página Inicial</Link>
          </div>
        </section>
      </main>
    </div>
  );
}