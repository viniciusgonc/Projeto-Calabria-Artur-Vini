import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header  from '../components/Header';
import Footer  from '../components/Footer';
import AlertaBox from '../components/AlertaBox';
import { Session } from '../services/session';
import {
  apiListarServicos,
  apiListarSolicitacoes,
  apiAtualizarSolicitacoes,
} from '../services/api';
import {
  formatarData,
  formatarMoeda,
  dataHoje,
  calcularDataPrevista,
} from '../services/validacoes';

export default function Servicos() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [catalogo,      setCatalogo]      = useState([]);
  const [solicitacoes,  setSolicitacoes]  = useState([]);
  const [servicoSel,    setServicoSel]    = useState('');
  const [carregando,    setCarregando]    = useState(true);
  const [salvando,      setSalvando]      = useState(false);
  const [alerta,        setAlerta]        = useState({ msg: '', tipo: 'erro' });

  const login = Session.getLogin();
  const nome  = Session.getNome();

  // ── Proteção de rota ─────────────────────────────────────────
  useEffect(() => {
    if (!Session.estaLogado()) {
      alert('Você precisa estar logado para acessar esta página.');
      navigate('/login');
    }
  }, [navigate]);

  // ── Carrega catálogo e solicitações ao montar ────────────────
  useEffect(() => {
    if (!Session.estaLogado()) return;

    async function carregar() {
      setCarregando(true);
      try {
        const [resCat, resSol] = await Promise.all([
          apiListarServicos(),
          apiListarSolicitacoes(login),
        ]);

        if (resCat.ok)  setCatalogo(resCat.dados);
        else setAlerta({ msg: 'Erro ao carregar catálogo de serviços: ' + resCat.erro, tipo: 'erro' });

        if (resSol.ok)  setSolicitacoes(resSol.dados);
        else setAlerta({ msg: 'Erro ao carregar solicitações: ' + resSol.erro, tipo: 'erro' });

      } catch {
        setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [login]);

  // ── Serviço selecionado (detalhes) ───────────────────────────
  const servicoAtual = catalogo.find(s => String(s.id) === String(servicoSel));

  // ── Incluir solicitação localmente (estado React) ─────────────
  function handleIncluir() {
    if (!servicoSel) {
      alert('Por favor, selecione um serviço antes de incluir.');
      return;
    }
    if (!servicoAtual) return;

    const nova = {
      servico_id:    servicoAtual.id,
      servico_nome:  servicoAtual.nome,
      preco:         servicoAtual.preco,
      icone:         servicoAtual.icone,
      data_pedido:   dataHoje(),
      data_prevista: calcularDataPrevista(servicoAtual.prazo_dias),
      status:        'EM ELABORAÇÃO',
      _local:        true,
    };
    setSolicitacoes(prev => [...prev, nova]);
    setServicoSel('');
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // ── Excluir solicitação localmente ───────────────────────────
  function handleExcluir(idx) {
    if (!window.confirm('Confirma a exclusão desta solicitação?')) return;
    setSolicitacoes(prev => prev.filter((_, i) => i !== idx));
  }

  // ── Salvar solicitações no backend ───────────────────────────
  async function handleSalvar() {
    setSalvando(true);
    setAlerta({ msg: '', tipo: 'erro' });
    try {
      const payload = solicitacoes.map(s => ({
        servico_id:   s.servico_id,
        data_pedido:  s.data_pedido,
        data_prevista:s.data_prevista,
        status:       s.status,
      }));
      const resultado = await apiAtualizarSolicitacoes(login, payload);
      if (resultado.ok) {
        // Recarrega do backend para pegar IDs reais
        const resSol = await apiListarSolicitacoes(login);
        if (resSol.ok) setSolicitacoes(resSol.dados);
        setAlerta({ msg: '✅ Solicitações salvas com sucesso!', tipo: 'sucesso' });
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao salvar solicitações.', tipo: 'erro' });
      }
    } catch {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor está rodando.', tipo: 'erro' });
    } finally {
      setSalvando(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main id="main-content" style={{ flex: 1 }}>
        <div className="servicos-page-wrapper">

          <h1 style={{ fontSize: '1.6rem', marginBottom: '.25rem' }}>Solicitação de Serviços de TI</h1>
          <p style={{ color: 'var(--ink-light)', marginBottom: '1.75rem', fontSize: '.95rem' }}>
            Gerencie suas solicitações e adicione novos serviços de TI.
          </p>

          {/* ── Usuário logado ── */}
          <section aria-label="Dados do usuário logado">
            <div className="user-info-bar">
              <div>
                <span className="info-label">Usuário logado:</span>
                <span className="info-valor">{nome}</span>
              </div>
              <div>
                <span className="info-label">E-mail:</span>
                <span className="info-valor">{login}</span>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Link to="/cadastro-servico" className="btn btn-outline" style={{ fontSize: '.85rem', padding: '.4rem 1rem', marginRight: '.5rem' }}>
                  ➕ Novo Serviço
                </Link>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '.85rem', padding: '.4rem 1rem' }}
                  onClick={() => { Session.limpar(); navigate('/'); }}>
                  🚪 Encerrar sessão
                </button>
              </div>
            </div>
          </section>

          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          {/* ── Tabela de Solicitações ── */}
          <section aria-label="Minhas solicitações de serviços">
            <h2 className="secao-titulo">
              📋 Minhas Solicitações
              <span className="contador-badge">{solicitacoes.length}</span>
            </h2>

            <div className="table-scroll">
              <table className="tabela-dados" aria-label="Lista de solicitações de serviços de TI">
                <thead>
                  <tr>
                    <th>📅 Data do Pedido</th>
                    <th># Solicitação</th>
                    <th>Serviço de TI</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Data Prevista</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {carregando ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--ink-light)' }}>
                        ⏳ Carregando solicitações...
                      </td>
                    </tr>
                  ) : solicitacoes.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-light)' }}>
                        Nenhuma solicitação encontrada. Use o formulário abaixo para adicionar.
                      </td>
                    </tr>
                  ) : (
                    solicitacoes.map((s, idx) => (
                      <tr key={s.id ?? `local-${idx}`}>
                        <td>{formatarData(s.data_pedido)}</td>
                        <td>#{s.id ?? `(novo)`}</td>
                        <td>{s.icone} {s.servico_nome}</td>
                        <td data-status={s.status}>{s.status}</td>
                        <td>{formatarMoeda(s.preco)}</td>
                        <td>{formatarData(s.data_prevista)}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleExcluir(idx)}
                            title="Excluir solicitação">
                            🗑️ Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Botão de salvar (atualiza no backend) */}
            {!carregando && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSalvar}
                  disabled={salvando}>
                  {salvando ? '⏳ Salvando...' : '💾 Salvar Solicitações'}
                </button>
              </div>
            )}
          </section>

          {/* ── Nova Solicitação ── */}
          <section aria-label="Adicionar nova solicitação de serviço" style={{ marginTop: '2.5rem' }}>
            <h2 className="secao-titulo">➕ Nova Solicitação</h2>

            <div className="solicitacao-card">
              <div className="form-group">
                <label htmlFor="sel-servico">
                  Serviço de TI <strong style={{ color: '#c53030' }}>*</strong>
                </label>
                <select
                  id="sel-servico"
                  value={servicoSel}
                  onChange={e => setServicoSel(e.target.value)}
                  style={{ border: '2px solid var(--brand)', fontWeight: 600 }}>
                  <option value="">-- Selecione um serviço --</option>
                  {catalogo.map(s => (
                    <option key={s.id} value={String(s.id)}>
                      {s.icone} {s.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Info do serviço selecionado */}
              <div className="servico-info-grid">
                <div>
                  <span className="info-label">💰 Preço</span>
                  <span className="info-valor">
                    {servicoAtual ? formatarMoeda(servicoAtual.preco) : '--'}
                  </span>
                </div>
                <div>
                  <span className="info-label">⏱️ Prazo de Atendimento</span>
                  <span className="info-valor">
                    {servicoAtual ? `${servicoAtual.prazo_dias} dia(s)` : '--'}
                  </span>
                </div>
                <div>
                  <span className="info-label">📅 Data Prevista de Atendimento</span>
                  <span className="info-valor">
                    {servicoAtual ? formatarData(calcularDataPrevista(servicoAtual.prazo_dias)) : '--'}
                  </span>
                </div>
                <div>
                  <span className="info-label">🔄 Status</span>
                  <span style={{ color: '#b7791f', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    {servicoAtual ? 'EM ELABORAÇÃO' : '--'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleIncluir}>
                  ✅ Incluir Solicitação
                </button>
                <Link to="/" className="btn btn-outline">
                  🏠 Voltar à Página Inicial
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}