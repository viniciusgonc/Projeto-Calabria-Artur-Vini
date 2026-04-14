/**
 * JaLegalizei TI — Funções de Validação Compartilhadas
 * Arquivo: js/validacoes.js
 */

/* ── Validação de e-mail ────────────────────────────────────── */
function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

/* ── Regras de senha ────────────────────────────────────────── */
const CARACTERES_PERMITIDOS_ESPECIAIS = '@#$%&*!?/\\|-_+=.';
const CARACTERES_PROIBIDOS = /[¨{}\[\]´`~^:;<>,"']/;

const INSTRUCAO_SENHA =
  'Regras para a senha:\n' +
  '• Mínimo de 6 caracteres\n' +
  '• Pelo menos um número (0-9)\n' +
  '• Pelo menos uma letra MAIÚSCULA\n' +
  '• Pelo menos um dos caracteres especiais PERMITIDOS:\n' +
  '  @ # $ % & * ! ? / \\ | - _ + . =\n\n' +
  'Caracteres NÃO PERMITIDOS na senha:\n' +
  '  ¨ { } [ ] ´ ` ~ ^ : ; < > , " \'';

function validarSenha(senha) {
  if (!senha || senha.length < 6) {
    return { valido: false, mensagem: 'A senha deve ter pelo menos 6 caracteres.' };
  }

  if (CARACTERES_PROIBIDOS.test(senha)) {
    return { valido: false, mensagem: 'A senha contém caractere(s) não permitido(s): ¨ { } [ ] ´ ` ~ ^ : ; < > , " \'' };
  }

  if (!/\d/.test(senha)) {
    return { valido: false, mensagem: 'A senha deve ter pelo menos um caractere numérico.' };
  }

  if (!/[A-Z]/.test(senha)) {
    return { valido: false, mensagem: 'A senha deve ter pelo menos uma letra maiúscula.' };
  }

  const reEspecial = /[@#$%&*!?/\\|\-_+.=]/;
  if (!reEspecial.test(senha)) {
    return { valido: false, mensagem: 'A senha deve ter pelo menos um caractere especial permitido: @ # $ % & * ! ? / \\ | - _ + . =' };
  }

  return { valido: true, mensagem: '' };
}

/* ── Validação de nome ──────────────────────────────────────── */
function validarNome(nome) {
  const trimmed = nome.trim();

  if (!trimmed) {
    return { valido: false, mensagem: 'O nome deve ser preenchido.' };
  }

  // Não permitir nenhum caractere especial das duas listas nem dígitos
  const reEspeciais = /[@#$%&*!?/\\|:;<>,"'¨{}\[\]´`~^_+=.\d\-]/;
  if (reEspeciais.test(trimmed)) {
    return { valido: false, mensagem: 'O nome não pode conter caracteres especiais ou números.' };
  }

  const palavras = trimmed.split(/\s+/).filter(p => p.length > 0);

  if (palavras.length < 2) {
    return { valido: false, mensagem: 'O nome deve ter pelo menos duas palavras.' };
  }

  if (palavras[0].length < 2) {
    return { valido: false, mensagem: 'A primeira palavra do nome deve ter pelo menos 2 caracteres.' };
  }

  return { valido: true, mensagem: '' };
}

/* ── Máscara de CPF ─────────────────────────────────────────── */
function mascaraCPF(input) {
  // Permitir apenas dígitos (0-9)
  let valor = input.value.replace(/\D/g, '');

  // Limitar a 11 dígitos
  if (valor.length > 11) valor = valor.slice(0, 11);

  // Aplicar máscara NNN.NNN.NNN-NN
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }

  input.value = valor;
}

/* Bloquear digitação de não-dígitos no campo CPF */
function bloquearNaoDigitoCPF(e) {
  const tecla = e.key;
  // Permitir: teclas de controle, Backspace, Delete, Tab, setas
  if (['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'].includes(tecla)) return;
  // Bloquear qualquer coisa que não seja dígito
  if (!/^\d$/.test(tecla)) {
    e.preventDefault();
  }
}

/* ── Validação de CPF (algoritmo de dígito verificador) ─────── */
function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, '');

  if (limpo.length !== 11) return false;

  // CPF com todos os dígitos iguais é inválido
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  // Cálculo do 1º dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;

  // Cálculo do 2º dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[10])) return false;

  return true;
}

/* ── Validação de data de nascimento (maioridade) ───────────── */
function validarMaioridade(dataStr) {
  if (!dataStr) return false;

  const hoje    = new Date();
  const nascimento = new Date(dataStr + 'T00:00:00');

  // Data inválida
  if (isNaN(nascimento.getTime())) return false;

  // Calcula idade
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mDif = hoje.getMonth() - nascimento.getMonth();

  if (mDif < 0 || (mDif === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 18;
}

/* ── Validação de telefone (opcional, formato nacional) ─────── */
function validarTelefone(tel) {
  if (!tel || tel.trim() === '') return true; // Campo opcional

  const limpo = tel.replace(/\D/g, '');
  // 10 dígitos = fixo com DDD; 11 dígitos = celular com DDD
  return limpo.length === 10 || limpo.length === 11;
}

/* ── Utilitários de UI ──────────────────────────────────────── */
function mostrarErro(campo, mensagem) {
  const erroId = campo.id + '-erro';
  let erroEl = document.getElementById(erroId);

  if (!erroEl) {
    erroEl = document.createElement('span');
    erroEl.id = erroId;
    erroEl.className = 'msg-erro';
    campo.parentNode.appendChild(erroEl);
  }

  erroEl.textContent = mensagem;
  campo.style.borderColor = '#fc8181';
}

function limparErro(campo) {
  const erroEl = document.getElementById(campo.id + '-erro');
  if (erroEl) erroEl.textContent = '';
  campo.style.borderColor = '';
}

function limparTodosErros(form) {
  form.querySelectorAll('.msg-erro').forEach(el => el.textContent = '');
  form.querySelectorAll('input, select').forEach(el => el.style.borderColor = '');
}

function mostrarAlerta(containerEl, mensagem, tipo = 'erro') {
  containerEl.className = 'alerta-box ' + tipo;
  containerEl.textContent = mensagem;
  containerEl.style.display = 'block';
}

function ocultarAlerta(containerEl) {
  containerEl.style.display = 'none';
  containerEl.textContent = '';
}
