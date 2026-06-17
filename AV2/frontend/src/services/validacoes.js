// ── E-mail ───────────────────────────────────────────────────
export function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

// ── Senha ────────────────────────────────────────────────────
export const INSTRUCAO_SENHA =
  'Regras para a senha:\n' +
  '• Mínimo de 6 caracteres\n' +
  '• Pelo menos um número (0-9)\n' +
  '• Pelo menos uma letra MAIÚSCULA\n' +
  '• Pelo menos um dos caracteres especiais PERMITIDOS:\n' +
  '  @ # $ % & * ! ? / \\ | - _ + . =\n\n' +
  'Caracteres NÃO PERMITIDOS na senha:\n' +
  '  ¨ { } [ ] ´ ` ~ ^ : ; < > , " \'';

const CARACTERES_PROIBIDOS = /[¨{}\[\]´`~^:;<>,"']/;

export function validarSenha(senha) {
  if (!senha || senha.length < 6)
    return { valido: false, mensagem: 'A senha deve ter pelo menos 6 caracteres.' };
  if (CARACTERES_PROIBIDOS.test(senha))
    return { valido: false, mensagem: "A senha contém caractere(s) não permitido(s): ¨ { } [ ] ´ ` ~ ^ : ; < > , \" '" };
  if (!/\d/.test(senha))
    return { valido: false, mensagem: 'A senha deve ter pelo menos um caractere numérico.' };
  if (!/[A-Z]/.test(senha))
    return { valido: false, mensagem: 'A senha deve ter pelo menos uma letra maiúscula.' };
  if (!/[@#$%&*!?/\\|\-_+.=]/.test(senha))
    return { valido: false, mensagem: 'A senha deve ter pelo menos um caractere especial permitido: @ # $ % & * ! ? / \\ | - _ + . =' };
  return { valido: true, mensagem: '' };
}

export function avaliarForcaSenha(senha) {
  if (!senha) return null;
  let pontos = 0;
  if (senha.length >= 6)  pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha))   pontos++;
  if (/[@#$%&*!?/\\|\-_+.=]/.test(senha)) pontos++;
  if (pontos <= 2) return { classe: 'forca-fraca',  texto: '🔴 Fraca' };
  if (pontos <= 3) return { classe: 'forca-media',  texto: '🟡 Moderada' };
  return           { classe: 'forca-forte',  texto: '🟢 Forte' };
}

// ── Nome ─────────────────────────────────────────────────────
export function validarNome(nome) {
  const trimmed = nome.trim();
  if (!trimmed) return { valido: false, mensagem: 'O nome deve ser preenchido.' };
  const reEsp = /[@#$%&*!?/\\|:;<>,"'¨{}\[\]´`~^_+=.\d\-]/;
  if (reEsp.test(trimmed)) return { valido: false, mensagem: 'O nome não pode conter caracteres especiais ou números.' };
  const palavras = trimmed.split(/\s+/).filter(p => p.length > 0);
  if (palavras.length < 2) return { valido: false, mensagem: 'O nome deve ter pelo menos duas palavras.' };
  if (palavras[0].length < 2) return { valido: false, mensagem: 'A primeira palavra do nome deve ter pelo menos 2 caracteres.' };
  return { valido: true, mensagem: '' };
}

// ── CPF ──────────────────────────────────────────────────────
export function mascaraCPF(valor) {
  let v = valor.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  return v;
}

export function validarCPF(cpf) {
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
  return resto === parseInt(limpo[10]);
}

// ── Maioridade ───────────────────────────────────────────────
export function validarMaioridade(dataStr) {
  if (!dataStr) return false;
  const hoje = new Date();
  const nasc = new Date(dataStr + 'T00:00:00');
  if (isNaN(nasc.getTime())) return false;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mDif = hoje.getMonth() - nasc.getMonth();
  if (mDif < 0 || (mDif === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 18;
}

// ── Telefone ─────────────────────────────────────────────────
export function validarTelefone(tel) {
  if (!tel || tel.trim() === '') return true;
  const limpo = tel.replace(/\D/g, '');
  return limpo.length === 10 || limpo.length === 11;
}

// ── Data helpers ─────────────────────────────────────────────
export function dataHoje() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

export function calcularDataPrevista(prazoDias) {
  const data = new Date();
  data.setDate(data.getDate() + prazoDias);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

export function formatarData(dataStr) {
  if (!dataStr) return '-';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function dataMaxHoje() {
  return dataHoje();
}