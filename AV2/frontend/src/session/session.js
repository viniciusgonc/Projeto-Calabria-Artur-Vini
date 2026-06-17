/**
 * Gerenciamento de sessão via sessionStorage.
 * Substitui o objeto Auth do main.js da AV1.
 * Usado diretamente (não é um Hook React) para ser acessível
 * de qualquer lugar sem precisar de contexto.
 */

const KEY_LOGIN = 'aw_login';
const KEY_NOME  = 'aw_nome';

export const Session = {
  salvar(login, nome) {
    sessionStorage.setItem(KEY_LOGIN, login);
    sessionStorage.setItem(KEY_NOME,  nome || 'Cliente ArtWinners');
  },

  limpar() {
    sessionStorage.removeItem(KEY_LOGIN);
    sessionStorage.removeItem(KEY_NOME);
  },

  estaLogado() {
    return !!sessionStorage.getItem(KEY_LOGIN);
  },

  getLogin() {
    return sessionStorage.getItem(KEY_LOGIN) || '';
  },

  getNome() {
    return sessionStorage.getItem(KEY_NOME) || 'Cliente';
  },
};