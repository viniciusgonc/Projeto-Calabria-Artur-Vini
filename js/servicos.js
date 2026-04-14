/**
 * JaLegalizei TI — servicos.js
 * Lógica da página de solicitação de serviços de TI
 */

/* ── Catálogo de serviços (dados fixos) ─────────────────────── */
const CATALOGO_SERVICOS = [
  { id: '',   nome: '-- Selecione um serviço --',          preco: null,   prazo: null },
  { id: 'DS', nome: 'Desenvolvimento de Software Sob Medida', preco: 8000.00, prazo: 30 },
  { id: 'ST', nome: 'Suporte Técnico Especializado',       preco:  600.00, prazo:  3 },
  { id: 'SI', nome: 'Segurança da Informação e Compliance',preco: 4500.00, prazo: 20 },
  { id: 'CC', nome: 'Computação em Nuvem (Cloud Setup)',   preco: 3200.00, prazo: 15 },
  { id: 'CT', nome: 'Consultoria em TI',                   preco: 2000.00, prazo: 10 },
  { id: 'GR', nome: 'Gestão e Monitoramento de Redes',     preco: 2800.00, prazo: 12 },
];

/* ── Solicitações iniciais (valores fictícios fixos) ────────── */
let solicitacoes = [
  {
    id: 1001,
    data: '2024-11-05',
    servico: 'Suporte Técnico Especializado',
    status: 'CONCLUÍDO',
    preco: 600.00,
    dataPrevista: '2024-11-08'
  },
  {
    id: 1002,
    data: '2024-12-10',
    servico: 'Segurança da Informação e Compliance',
    status: 'EM ANDAMENTO',
    preco: 4500.00,
    dataPrevista: '2024-12-30'
  },
  {
    id: 1003,
    data: '2025-01-15',
    servico: 'Computação em Nuvem (Cloud Setup)',
    status: 'EM ELABORAÇÃO',
    preco: 3200.00,
    dataPrevista: '2025-01-30'
  }
];

let proximoId = 1004;

/* ── Formata moeda BRL ──────────────────────────────────────── */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ── Formata data para pt-BR ────────────────────────────────── */
function formatarData(dataStr) {
  if (!dataStr) return '-';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

/* ── Calcula data prevista (hoje + prazo em dias) ───────────── */
function calcularDataPrevista(prazoDias) {
  const data = new Date();
  data.setDate(data.getDate() + prazoDias);
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

/* ── Ordena solicitações por data (crescente) ───────────────── */
function ordenarSolicitacoes() {
  solicitacoes.sort((a, b) => new Date(a.data) - new Date(b.data));
}

/* ── Exclui solicitação pelo id ─────────────────────────────── */
function excluirSolicitacao(id) {
  if (confirm(`Confirma a exclusão da solicitação #${id}?`)) {
    solicitacoes = solicitacoes.filter(s => s.id !== id);
    renderizarTabela();
  }
}

/* ── Renderiza a tabela de solicitações ─────────────────────── */
function renderizarTabela() {
  const tbody = document.getElementById('tbody-solicitacoes');
  if (!tbody) return;

  ordenarSolicitacoes();

  if (solicitacoes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:#4a5568;">
          Nenhuma solicitação encontrada.
        </td>
      </tr>`;
    return;
  }

  // Atualiza contador badge
  const badge = document.getElementById('contador-sol');
  if (badge) badge.textContent = solicitacoes.length;

  tbody.innerHTML = solicitacoes.map(s => `
    <tr>
      <td>${formatarData(s.data)}</td>
      <td>#${s.id}</td>
      <td>${s.servico}</td>
      <td data-status="${s.status}">${s.status}</td>
      <td>${formatarMoeda(s.preco)}</td>
      <td>${formatarData(s.dataPrevista)}</td>
      <td>
        <button
          class="btn btn-danger"
          onclick="excluirSolicitacao(${s.id})"
          title="Excluir solicitação #${s.id}">
          Excluir
        </button>
      </td>
    </tr>
  `).join('');
}

/* ── Atualiza labels quando o serviço é selecionado ────────── */
function onServicoChange() {
  const select    = document.getElementById('sel-servico');
  const lblPreco  = document.getElementById('lbl-preco');
  const lblPrazo  = document.getElementById('lbl-prazo');
  const lblData   = document.getElementById('lbl-data-prevista');
  const lblStatus = document.getElementById('lbl-status');

  const servicoId = select.value;
  const item = CATALOGO_SERVICOS.find(s => s.id === servicoId);

  if (!item || !item.preco) {
    lblPreco.textContent  = '--';
    lblPrazo.textContent  = '--';
    lblData.textContent   = '--';
    lblStatus.textContent = '--';
    return;
  }

  lblPreco.textContent  = formatarMoeda(item.preco);
  lblPrazo.textContent  = `${item.prazo} dia(s)`;
  lblData.textContent   = formatarData(calcularDataPrevista(item.prazo));
  lblStatus.textContent = 'EM ELABORAÇÃO';
}

/* ── Inclui nova solicitação na tabela ──────────────────────── */
function incluirSolicitacao() {
  const select = document.getElementById('sel-servico');
  const servicoId = select.value;

  if (!servicoId) {
    alert('Por favor, selecione um serviço antes de incluir.');
    select.focus();
    return;
  }

  const item = CATALOGO_SERVICOS.find(s => s.id === servicoId);
  if (!item) return;

  const hoje = new Date();
  const ano  = hoje.getFullYear();
  const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia  = String(hoje.getDate()).padStart(2, '0');

  const nova = {
    id:           proximoId++,
    data:         `${ano}-${mes}-${dia}`,
    servico:      item.nome,
    status:       'EM ELABORAÇÃO',
    preco:        item.preco,
    dataPrevista: calcularDataPrevista(item.prazo)
  };

  solicitacoes.push(nova);
  renderizarTabela();

  // Limpa o formulário
  select.value = '';
  onServicoChange();

  alert(`Solicitação #${nova.id} incluída com sucesso!`);
}

/* ── Inicialização da página ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  // Verifica login
  if (!Auth.estaLogado()) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Preenche labels do usuário logado
  const nomeEl  = document.getElementById('lbl-nome-usuario');
  const emailEl = document.getElementById('lbl-email-usuario');
  if (nomeEl)  nomeEl.textContent  = Auth.getNome();
  if (emailEl) emailEl.textContent = Auth.getEmail();

  // Popula o combo de serviços
  const select = document.getElementById('sel-servico');
  if (select) {
    CATALOGO_SERVICOS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.nome;
      select.appendChild(opt);
    });
    select.addEventListener('change', onServicoChange);
  }

  // Botão incluir
  const btnIncluir = document.getElementById('btn-incluir-servico');
  if (btnIncluir) btnIncluir.addEventListener('click', incluirSolicitacao);

  // Renderiza tabela inicial
  renderizarTabela();
});
