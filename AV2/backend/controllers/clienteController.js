const bcrypt = require('bcryptjs');
const { getDb } = require('../config/database');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/login
 * Body: { login, senha }
 * Return: { ok: true } | { ok: false, erro: "..." }
 */
function autenticar(req, res) {
  const { login, senha } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ ok: false, erro: 'Login e senha são obrigatórios.' });
  }

  try {
    const db = getDb();
    const cliente = db.prepare('SELECT senha_hash FROM cliente WHERE login = ?').get(login.trim());
    if (!cliente) {
      return res.json({ ok: false });
    }
    const match = bcrypt.compareSync(senha, cliente.senha_hash);
    return res.json({ ok: match });
  } catch (err) {
    console.error('autenticar:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao autenticar.' });
  }
}

/**
 * POST /api/auth/trocar-senha
 * Body: { login, senhaAtual, novaSenha }
 * Return: { ok: true } | { ok: false, erro: "..." }
 */
function trocarSenha(req, res) {
  const { login, senhaAtual, novaSenha } = req.body;
  if (!login || !senhaAtual || !novaSenha) {
    return res.status(400).json({ ok: false, erro: 'Login, senha atual e nova senha são obrigatórios.' });
  }

  try {
    const db = getDb();
    const cliente = db.prepare('SELECT senha_hash FROM cliente WHERE login = ?').get(login.trim());
    if (!cliente) {
      return res.status(401).json({ ok: false, erro: 'Login ou senha atual incorretos.' });
    }

    const match = bcrypt.compareSync(senhaAtual, cliente.senha_hash);
    if (!match) {
      return res.status(401).json({ ok: false, erro: 'Login ou senha atual incorretos.' });
    }

    const novoHash = bcrypt.hashSync(novaSenha, SALT_ROUNDS);
    db.prepare('UPDATE cliente SET senha_hash = ? WHERE login = ?').run(novoHash, login.trim());
    return res.json({ ok: true });
  } catch (err) {
    console.error('trocarSenha:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao trocar a senha.' });
  }
}

/**
 * POST /api/clientes
 * Body: { login, senha, nome, cpf, nascimento, telefone, estado_civil, escolaridade }
 * Return: { ok: true } | { ok: false, erro: "..." }
 */
function cadastrarCliente(req, res) {
  const { login, senha, nome, cpf, nascimento, telefone, estado_civil, escolaridade } = req.body;

  if (!login || !senha || !nome || !cpf || !nascimento) {
    return res.status(400).json({ ok: false, erro: 'Campos obrigatórios ausentes.' });
  }

  try {
    const db = getDb();
    const existe = db.prepare('SELECT 1 FROM cliente WHERE login = ?').get(login.trim());
    if (existe) {
      return res.status(409).json({ ok: false, erro: 'Este e-mail já está cadastrado. Use outro ou faça login.' });
    }

    const hash = bcrypt.hashSync(senha, SALT_ROUNDS);
    db.prepare(`
      INSERT INTO cliente (login, senha_hash, nome, cpf, nascimento, telefone, estado_civil, escolaridade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      login.trim(),
      hash,
      nome.trim(),
      cpf.trim(),
      nascimento.trim(),
      (telefone || '').trim(),
      estado_civil || 'solteiro',
      escolaridade || '2g_comp'
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('cadastrarCliente:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao cadastrar cliente.' });
  }
}

module.exports = { autenticar, trocarSenha, cadastrarCliente };