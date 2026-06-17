const BASE = '/api';

async function handleResponse(res) {
  const data = await res.json();
  return data;
}

// ── Auth ──────────────────────────────────────────────────────

export async function apiLogin(login, senha) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha }),
  });
  return handleResponse(res);
}

export async function apiTrocarSenha(login, senhaAtual, novaSenha) {
  const res = await fetch(`${BASE}/auth/trocar-senha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senhaAtual, novaSenha }),
  });
  return handleResponse(res);
}

// ── Clientes ──────────────────────────────────────────────────

export async function apiCadastrarCliente(dados) {
  const res = await fetch(`${BASE}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

// ── Serviços de TI ────────────────────────────────────────────

export async function apiListarServicos() {
  const res = await fetch(`${BASE}/servicos`);
  return handleResponse(res);
}

export async function apiCadastrarServico(dados) {
  const res = await fetch(`${BASE}/servicos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return handleResponse(res);
}

// ── Solicitações ──────────────────────────────────────────────

export async function apiListarSolicitacoes(login) {
  const res = await fetch(`${BASE}/solicitacoes/${encodeURIComponent(login)}`);
  return handleResponse(res);
}

export async function apiAtualizarSolicitacoes(login, solicitacoes) {
  const res = await fetch(`${BASE}/solicitacoes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, solicitacoes }),
  });
  return handleResponse(res);
}