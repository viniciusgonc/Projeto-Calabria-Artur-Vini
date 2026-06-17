import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header  from '../components/Header';
import Footer  from '../components/Footer';
import AlertaBox from '../components/AlertaBox';
import { apiCadastrarServico } from '../services/api';
import { Session } from '../services/session';

const ICONES = ['💻','🛠️','🛡️','☁️','📊','🌐','🎮','📱','🔒','🗄️'];

export default function CadastroServico() {
  const navigate = useNavigate();

  // ── Proteção de rota ─────────────────────────────────────────
  useEffect(() => {
    if (!Session.estaLogado()) {
      alert('Você precisa estar logado para acessar esta página.');
      navigate('/login');
    }
  }, [navigate]);

  // ── Estado ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    nome:      '',
    descricao: '',
    preco:     '',
    prazo_dias:'',
    icone:     '💻',
  });
  const [erros,   setErros]   = useState({});
  const [alerta,  setAlerta]  = useState({ msg: '', tipo: 'erro' });
  const [loading, setLoading] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────
  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  // ── Validação local ─────────────────────────────────────────
  function validar() {
    const e = {};

    if (!form.nome.trim()) {
      e.nome = 'O nome do serviço deve ser preenchido.';
    } else if (form.nome.trim().length < 5) {
      e.nome = 'O nome deve ter pelo menos 5 caracteres.';
    }

    if (!form.preco) {
      e.preco = 'O preço deve ser preenchido.';
    } else if (isNaN(parseFloat(form.preco)) || parseFloat(form.preco) <= 0) {
      e.preco = 'Informe um preço válido e positivo.';
    }

    if (!form.prazo_dias) {
      e.prazo_dias = 'O prazo deve ser preenchido.';
    } else if (isNaN(parseInt(form.prazo_dias, 10)) || parseInt(form.prazo_dias, 10) <= 0) {
      e.prazo_dias = 'Informe um prazo inteiro e positivo (em dias).';
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
      const resultado = await apiCadastrarServico({
        nome:      form.nome.trim(),
        descricao: form.descricao.trim(),
        preco:     parseFloat(form.preco),
        prazo_dias:parseInt(form.prazo_dias, 10),
        icone:     form.icone,
      });

      if (resultado.ok) {
        alert('Validação realizada com sucesso! Serviço cadastrado.');
        handleLimpar();
        setAlerta({ msg: `✅ Serviço cadastrado com sucesso! (ID: ${resultado.id})`, tipo: 'sucesso' });
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao cadastrar o serviço.', tipo: 'erro' });
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setForm({ nome: '', descricao: '', preco: '', prazo_dias: '', icone: '💻' });
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main id="main-content" style={{ flex: 1, background: 'var(--gray-100)', padding: '2.5rem 1rem' }}>
        <section className="form-wrapper" style={{ maxWidth: '620px' }} aria-label="Cadastro de Serviço de TI">
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Cadastro de Serviço de TI</h1>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          {/* Nome */}
          <div className="form-group">
            <label htmlFor="sv-nome">
              Nome do Serviço <strong style={{ color: '#c53030' }}>*</strong>
            </label>
            <input
              type="text"
              id="sv-nome"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Ex: Desenvolvimento de Software Sob Medida"
              maxLength={120}
              className={erros.nome ? 'campo-erro' : ''}
            />
            {erros.nome && <span className="msg-erro">{erros.nome}</span>}
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label htmlFor="sv-desc">
              Descrição <span style={{ color: 'var(--ink-light)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <textarea
              id="sv-desc"
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              placeholder="Descreva brevemente o serviço..."
              maxLength={300}
              rows={3}
            />
          </div>

          {/* Preço e Prazo */}
          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="sv-preco">
                Preço (R$) <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <input
                type="number"
                id="sv-preco"
                value={form.preco}
                onChange={e => set('preco', e.target.value)}
                placeholder="Ex: 2000.00"
                min="0"
                step="0.01"
                className={erros.preco ? 'campo-erro' : ''}
              />
              {erros.preco && <span className="msg-erro">{erros.preco}</span>}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="sv-prazo">
                Prazo (dias) <strong style={{ color: '#c53030' }}>*</strong>
              </label>
              <input
                type="number"
                id="sv-prazo"
                value={form.prazo_dias}
                onChange={e => set('prazo_dias', e.target.value)}
                placeholder="Ex: 15"
                min="1"
                step="1"
                className={erros.prazo_dias ? 'campo-erro' : ''}
              />
              {erros.prazo_dias && <span className="msg-erro">{erros.prazo_dias}</span>}
            </div>
          </div>

          {/* Ícone */}
          <div className="form-group">
            <label>Ícone do Serviço</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.4rem' }}>
              {ICONES.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => set('icone', ic)}
                  title={ic}
                  style={{
                    fontSize: '1.5rem',
                    padding: '.4rem .6rem',
                    borderRadius: 'var(--radius)',
                    border: form.icone === ic ? '2px solid var(--brand)' : '2px solid var(--gray-200)',
                    background: form.icone === ic ? 'var(--brand-tint)' : 'var(--white)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}>
                  {ic}
                </button>
              ))}
            </div>
            <span className="aviso-campo">Ícone selecionado: {form.icone}</span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleIncluir}
              disabled={loading}>
              {loading ? '⏳ Salvando...' : '✅ Incluir Serviço'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLimpar}>
              🗑️ Limpar
            </button>
            <Link to="/servicos" className="btn btn-outline">
              ← Voltar
            </Link>
          </div>

          <p style={{ fontSize: '.78rem', color: 'var(--ink-light)', marginTop: '.75rem' }}>
            <strong style={{ color: '#c53030' }}>*</strong> Campos obrigatórios
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}