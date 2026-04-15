const Auth = {
  KEY_LOGGED:  'jlti_loggedIn',
  KEY_EMAIL:   'jlti_email',
  KEY_NOME:    'jlti_nome',

  login(email, nome) {
    sessionStorage.setItem(this.KEY_LOGGED, 'true');
    sessionStorage.setItem(this.KEY_EMAIL,  email);
    sessionStorage.setItem(this.KEY_NOME,   nome || 'Cliente ArtWinners');
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

function atualizarNavServicos() {
  const itemServicos = document.getElementById('nav-item-servicos');
  const itemLogin    = document.getElementById('nav-item-login');
  const itemCadastro = document.getElementById('nav-item-cadastro');
  const itemLogout   = document.getElementById('nav-item-logout');

  if (Auth.estaLogado()) {
    if (itemServicos) itemServicos.style.display = 'list-item';
    if (itemLogout)   itemLogout.style.display   = 'list-item';

    if (itemLogin)    itemLogin.style.display    = 'none';
    if (itemCadastro) itemCadastro.style.display = 'none';
  } else {
    if (itemServicos) itemServicos.style.display = 'none';
    if (itemLogout)   itemLogout.style.display   = 'none';

    if (itemLogin)    itemLogin.style.display    = 'list-item';
    if (itemCadastro) itemCadastro.style.display = 'list-item';
  }
}

function getIconeOlho() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"></path>
      <circle cx="12" cy="12" r="3.2"></circle>
    </svg>
  `;
}

function getIconeOlhoFechado() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 3l18 18"></path>
      <path d="M10.6 6.3A10.9 10.9 0 0 1 12 6c7 0 10.5 6 10.5 6a18.8 18.8 0 0 1-4.2 4.9"></path>
      <path d="M6.7 6.7A18.2 18.2 0 0 0 1.5 12s3.5 7 10.5 7c1.9 0 3.6-.4 5.1-1.1"></path>
      <path d="M9.9 9.9A3 3 0 0 0 9 12a3 3 0 0 0 4.6 2.6"></path>
    </svg>
  `;
}

function toggleSenha(inputId, botao) {
  const input = document.getElementById(inputId);
  if (!input || !botao) return;

  const mostrando = input.type === 'text';

  if (mostrando) {
    input.type = 'password';
    botao.innerHTML = getIconeOlho();
    botao.setAttribute('aria-label', 'Mostrar senha');
    botao.setAttribute('title', 'Mostrar senha');
  } else {
    input.type = 'text';
    botao.innerHTML = getIconeOlhoFechado();
    botao.setAttribute('aria-label', 'Ocultar senha');
    botao.setAttribute('title', 'Ocultar senha');
  }
}

function resetarBotoesSenha(container) {
  if (!container) return;

  container.querySelectorAll('.senha-wrapper input').forEach(function (input) {
    input.type = 'password';
  });

  container.querySelectorAll('.btn-toggle-senha').forEach(function (botao) {
    botao.innerHTML = getIconeOlho();
    botao.setAttribute('aria-label', 'Mostrar senha');
    botao.setAttribute('title', 'Mostrar senha');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  atualizarNavServicos();
  resetarBotoesSenha(document);
});