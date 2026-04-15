const Auth = {
  /**
   * Chama após login bem-sucedido para salvar o nome localmente.
   * (O email e UID já ficam no Firebase)
   */
  login(email, nome) {
    sessionStorage.setItem('jlti_nome', nome || 'Cliente ArtWinners');
  },
 
  /** Faz logout pelo Firebase e limpa o storage */
  logout() {
    if (typeof fbAuth !== 'undefined') {
      fbAuth.signOut();
    }
    sessionStorage.removeItem('jlti_nome');
  },
 
  /** Verifica se há um usuário autenticado no Firebase */
  estaLogado() {
    if (typeof fbAuth === 'undefined') return false;
    return fbAuth.currentUser !== null;
  },
 
  /** Retorna o email do usuário atual */
  getEmail() {
    if (typeof fbAuth !== 'undefined' && fbAuth.currentUser) {
      return fbAuth.currentUser.email || '';
    }
    return '';
  },
 
  /** Retorna o nome salvo em sessão ou 'Cliente' */
  getNome() {
    return sessionStorage.getItem('jlti_nome') || 'Cliente';
  },
 
  /** Retorna o UID do usuário atual (necessário para o Firestore) */
  getUID() {
    if (typeof fbAuth !== 'undefined' && fbAuth.currentUser) {
      return fbAuth.currentUser.uid;
    }
    return null;
  }
};
 
/* ══════════════════════════════════════════════════════════════
   Navegação — atualiza os links de acordo com o estado de login
   ══════════════════════════════════════════════════════════════ */
function atualizarNavServicos(logado) {
  const itemServicos = document.getElementById('nav-item-servicos');
  const itemLogin    = document.getElementById('nav-item-login');
  const itemCadastro = document.getElementById('nav-item-cadastro');
  const itemLogout   = document.getElementById('nav-item-logout');
 
  if (logado) {
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
 
/* ══════════════════════════════════════════════════════════════
   Olhinho — toggle de visibilidade da senha
   ══════════════════════════════════════════════════════════════ */
 
/** Ícone de olho aberto (senha oculta) */
function getIconeOlho() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/>
    <circle cx="12" cy="12" r="3.2"/>
  </svg>`;
}
 
/** Ícone de olho riscado (senha visível) */
function getIconeOlhoFechado() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <line x1="3" y1="3" x2="21" y2="21"/>
    <path d="M10.6 6.3A10.9 10.9 0 0 1 12 6c7 0 10.5 6 10.5 6a18.8 18.8 0 0 1-4.2 4.9"/>
    <path d="M6.7 6.7A18.2 18.2 0 0 0 1.5 12s3.5 7 10.5 7c1.9 0 3.6-.4 5.1-1.1"/>
    <path d="M9.9 9.9A3 3 0 0 0 9 12a3 3 0 0 0 4.6 2.6"/>
  </svg>`;
}
 
/**
 * Alterna visibilidade da senha e troca o ícone do botão.
 * @param {string} inputId - ID do campo de senha
 * @param {HTMLButtonElement} botao - Botão clicado
 */
function toggleSenha(inputId, botao) {
  const input = document.getElementById(inputId);
  if (!input || !botao) return;
 
  const estaOculta = input.type === 'password';
 
  if (estaOculta) {
    input.type = 'text';
    botao.innerHTML = getIconeOlhoFechado();
    botao.setAttribute('aria-label', 'Ocultar senha');
    botao.setAttribute('title',      'Ocultar senha');
    botao.classList.add('ativo');
  } else {
    input.type = 'password';
    botao.innerHTML = getIconeOlho();
    botao.setAttribute('aria-label', 'Mostrar senha');
    botao.setAttribute('title',      'Mostrar senha');
    botao.classList.remove('ativo');
  }
}
 
/**
 * Garante que todos os campos de senha e seus botões estão no estado inicial.
 * @param {HTMLElement} container - Elemento pai que contém os campos
 */
function resetarBotoesSenha(container) {
  if (!container) return;
 
  container.querySelectorAll('.senha-wrapper input').forEach(input => {
    input.type = 'password';
  });
 
  container.querySelectorAll('.btn-toggle-senha').forEach(botao => {
    botao.innerHTML = getIconeOlho();
    botao.setAttribute('aria-label', 'Mostrar senha');
    botao.setAttribute('title',      'Mostrar senha');
    botao.classList.remove('ativo');
  });
}
 
/* ══════════════════════════════════════════════════════════════
   DOMContentLoaded — inicialização geral
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  // Inicializa os botões de olhinho na página
  resetarBotoesSenha(document);
 
  // Observa o estado de autenticação do Firebase
  if (typeof fbAuth !== 'undefined') {
    fbAuth.onAuthStateChanged(user => {
      atualizarNavServicos(!!user);
 
      // Se o usuário logou, busca o nome no Firestore para atualizar o sessionStorage
      if (user && typeof db !== 'undefined') {
        buscarPerfil(user.uid)
          .then(perfil => {
            if (perfil && perfil.nome) {
              sessionStorage.setItem('jlti_nome', perfil.nome);
            }
          })
          .catch(() => {}); // silencia erros não críticos
      }
    });
  } else {
    // Fallback se o Firebase não estiver carregado (ambiente sem config)
    atualizarNavServicos(false);
  }
});