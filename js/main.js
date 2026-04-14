/**
 * JaLegalizei TI — main.js
 * Gerenciamento do estado de login e utilitários compartilhados
 */

/* ── Estado de login (sessionStorage) ──────────────────────── */
const Auth = {
  KEY_LOGGED:  'jlti_loggedIn',
  KEY_EMAIL:   'jlti_email',
  KEY_NOME:    'jlti_nome',

  login(email, nome) {
    sessionStorage.setItem(this.KEY_LOGGED, 'true');
    sessionStorage.setItem(this.KEY_EMAIL,  email);
    sessionStorage.setItem(this.KEY_NOME,   nome || 'Cliente JaLegalizei');
  },

  logout() {
    sessionStorage.removeItem(this.KEY_LOGGED);
    sessionStorage.removeItem(this.KEY_EMAIL);
    sessionStorage.removeItem(this.KEY_NOME);
  },

  estaLogado() {
    return sessionStorage.getItem(this.KEY_LOGGED) === 'true';
  },

  getEmail() {
    return sessionStorage.getItem(this.KEY_EMAIL) || '';
  },

  getNome() {
    return sessionStorage.getItem(this.KEY_NOME) || 'Cliente';
  }
};

/* ── Atualiza link de Serviços na nav (visível só se logado) ── */
function atualizarNavServicos() {
  const itemServicos = document.getElementById('nav-item-servicos');
  if (!itemServicos) return;

  if (Auth.estaLogado()) {
    itemServicos.style.display = 'list-item';
  } else {
    itemServicos.style.display = 'none';
  }
}

/* Executar ao carregar qualquer página */
document.addEventListener('DOMContentLoaded', function () {
  atualizarNavServicos();
});
