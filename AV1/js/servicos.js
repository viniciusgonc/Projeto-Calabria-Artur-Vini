const CATALOGO_SERVICOS = [
  { id: 'DS', nome: 'Desenvolvimento de Software Sob Medida', preco: 8000.00, prazo: 30 },
  { id: 'ST', nome: 'Suporte Técnico Especializado',          preco:  600.00, prazo:  3 },
  { id: 'SI', nome: 'Segurança da Informação e Compliance',   preco: 4500.00, prazo: 20 },
  { id: 'CC', nome: 'Computação em Nuvem (Cloud Setup)',      preco: 3200.00, prazo: 15 },
  { id: 'CT', nome: 'Consultoria em TI',                      preco: 2000.00, prazo: 10 },
  { id: 'GR', nome: 'Gestão e Monitoramento de Redes',        preco: 2800.00, prazo: 12 },
  { id: 'CJ', nome: 'Criação de Jogos Digitais',            preco: 10000.00, prazo: 45 },
];
 
/** Guarda a função de cancelar o listener do Firestore */
let unsubscribeSolicitacoes = null;
 
/* ── Formatadores ───────────────────────────────────────────── */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
 
function formatarData(dataStr) {
  if (!dataStr) return '-';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}
 
function calcularDataPrevista(prazoDias) {
  const data = new Date();
  data.setDate(data.getDate() + prazoDias);
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}
 
function dataHoje() {
  const hoje = new Date();
  const a = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, '0');
  const d = String(hoje.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}
 
/* ── Renderização da tabela ─────────────────────────────────── */
function renderizarTabela(itens) {
  const tbody = document.getElementById('tbody-solicitacoes');
  const badge = document.getElementById('contador-sol');
  if (!tbody) return;
 
  if (badge) badge.textContent = itens.length;
 
  if (itens.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:#4a5568;">
          Nenhuma solicitação encontrada. Use o formulário abaixo para adicionar.
        </td>
      </tr>`;
    return;
  }
 
  tbody.innerHTML = itens.map(s => `
    <tr>
      <td>${formatarData(s.data)}</td>
      <td>#${s.id || s._docId}</td>
      <td>${s.servico}</td>
      <td data-status="${s.status}">${s.status}</td>
      <td>${formatarMoeda(s.preco)}</td>
      <td>${formatarData(s.dataPrevista)}</td>
      <td>
        <button
          class="btn btn-danger"
          onclick="excluirSolicitacao('${s._docId}')"
          title="Excluir solicitação">
          🗑️ Excluir
        </button>
      </td>
    </tr>
  `).join('');
}
 
/* ── Exclusão ───────────────────────────────────────────────── */
async function excluirSolicitacao(docId) {
  if (!confirm('Confirma a exclusão desta solicitação?')) return;
 
  const uid = Auth.getUID();
  if (!uid) return;
 
  try {
    await excluirSolicitacaoFS(uid, docId);
    // A tabela é atualizada automaticamente pelo listener onSnapshot
  } catch (err) {
    console.error('Erro ao excluir:', err);
    alert('Erro ao excluir a solicitação. Tente novamente.');
  }
}
 
/* ── Atualiza labels ao selecionar serviço ──────────────────── */
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
 
/* ── Inclusão de solicitação ────────────────────────────────── */
async function incluirSolicitacao() {
  const select    = document.getElementById('sel-servico');
  const btnIncl   = document.getElementById('btn-incluir-servico');
  const servicoId = select.value;
 
  if (!servicoId) {
    alert('Por favor, selecione um serviço antes de incluir.');
    select.focus();
    return;
  }
 
  const item = CATALOGO_SERVICOS.find(s => s.id === servicoId);
  if (!item) return;
 
  const uid = Auth.getUID();
  if (!uid) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }
 
  // Feedback visual enquanto salva
  if (btnIncl) {
    btnIncl.disabled = true;
    btnIncl.textContent = '⏳ Salvando...';
  }
 
  const nova = {
    id:           Date.now(),
    data:         dataHoje(),
    servico:      item.nome,
    status:       'EM ELABORAÇÃO',
    preco:        item.preco,
    dataPrevista: calcularDataPrevista(item.prazo)
  };
 
  try {
    await adicionarSolicitacao(uid, nova);
    // Limpa o formulário
    select.value = '';
    onServicoChange();
    alert('Solicitação incluída com sucesso!');
  } catch (err) {
    console.error('Erro ao incluir solicitação:', err);
    alert('Erro ao salvar a solicitação. Verifique sua conexão e tente novamente.');
  } finally {
    if (btnIncl) {
      btnIncl.disabled = false;
      btnIncl.innerHTML = '✅ Incluir Solicitação';
    }
  }
}
 
/* ── Inicialização ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  // Aguarda o Firebase resolver o estado de autenticação
  if (typeof fbAuth === 'undefined') {
    alert('Firebase não configurado. Verifique firebase-config.js.');
    return;
  }
 
  fbAuth.onAuthStateChanged(async user => {
    if (!user) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = 'login.html';
      return;
    }
 
    // Exibe dados do usuário logado
    const nomeEl  = document.getElementById('lbl-nome-usuario');
    const emailEl = document.getElementById('lbl-email-usuario');
    if (emailEl) emailEl.textContent = user.email;
 
    // Busca o nome no Firestore
    if (typeof buscarPerfil === 'function') {
      const perfil = await buscarPerfil(user.uid).catch(() => null);
      if (perfil && nomeEl) nomeEl.textContent = perfil.nome || 'Cliente';
    }
 
    // Popula o combo de serviços
    const select = document.getElementById('sel-servico');
    if (select && select.options.length <= 1) {
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
    if (btnIncluir) {
      btnIncluir.removeEventListener('click', incluirSolicitacao); // evita duplicar
      btnIncluir.addEventListener('click', incluirSolicitacao);
    }
 
    // Ativa listener em tempo real do Firestore
    if (unsubscribeSolicitacoes) unsubscribeSolicitacoes(); // cancela listener anterior se houver
    unsubscribeSolicitacoes = ouvirSolicitacoes(user.uid, renderizarTabela);
  });
});
 
// Cancela o listener ao sair da página
window.addEventListener('beforeunload', () => {
  if (unsubscribeSolicitacoes) unsubscribeSolicitacoes();
});