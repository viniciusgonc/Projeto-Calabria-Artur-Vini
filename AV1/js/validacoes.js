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
  let valor = input.value.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  input.value = valor;
}
 
function bloquearNaoDigitoCPF(e) {
  const tecla = e.key;
  if (['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'].includes(tecla)) return;
  if (!/^\d$/.test(tecla)) e.preventDefault();
}
 
/* ── Validação de CPF (dígito verificador) ──────────────────── */
function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;
 
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;
 
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[10])) return false;
 
  return true;
}
 
/* ── Validação de maioridade ────────────────────────────────── */
function validarMaioridade(dataStr) {
  if (!dataStr) return false;
  const hoje      = new Date();
  const nasc      = new Date(dataStr + 'T00:00:00');
  if (isNaN(nasc.getTime())) return false;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mDif = hoje.getMonth() - nasc.getMonth();
  if (mDif < 0 || (mDif === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 18;
}
 
/* ── Validação de telefone (opcional) ───────────────────────── */
function validarTelefone(tel) {
  if (!tel || tel.trim() === '') return true;
  const limpo = tel.replace(/\D/g, '');
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