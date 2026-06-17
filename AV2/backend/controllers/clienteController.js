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
    // Usando callbacks assíncronos compatíveis com a biblioteca 'sqlite3'
    db.get('SELECT senha_hash FROM cliente WHERE login = ?', [login.trim()], (err, cliente) => {
      if (err) {
        console.error('Erro na BD (autenticar):', err);
        return res.status(500).json({ ok: false, erro: 'Erro interno ao autenticar.' });
      }
      if (!cliente) {
        // Conforme a especificação, devolve false se o login não existir
        return res.json({ ok: false });
      }

      // Compara a senha enviada com a hash guardada
      const match = bcrypt.compareSync(senha, cliente.senha_hash);
      return res.json({ ok: match });
    });
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
    db.get('SELECT senha_hash FROM cliente WHERE login = ?', [login.trim()], (err, cliente) => {
      if (err) {
        console.error('Erro na BD (trocarSenha):', err);
        return res.status(500).json({ ok: false, erro: 'Erro interno ao consultar o cliente.' });
      }
      if (!cliente) {
        return res.status(401).json({ ok: false, erro: 'Login ou senha atual incorretos.' });
      }

      const match = bcrypt.compareSync(senhaAtual, cliente.senha_hash);
      if (!match) {
        return res.status(401).json({ ok: false, erro: 'Login ou senha atual incorretos.' });
      }

      const novoHash = bcrypt.hashSync(novaSenha, SALT_ROUNDS);
      // Atualiza a senha se a validação estiver correta
      db.run('UPDATE cliente SET senha_hash = ? WHERE login = ?', [novoHash, login.trim()], function(updateErr) {
        if (updateErr) {
          console.error('Erro no Update (trocarSenha):', updateErr);
          return res.status(500).json({ ok: false, erro: 'Erro interno ao trocar a senha.' });
        }
        return res.json({ ok: true });
      });
    });
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

  // Validação dos dados obrigatórios
  if (!login || !senha || !nome || !cpf || !nascimento) {
    return res.status(400).json({ ok: false, erro: 'Campos obrigatórios ausentes.' });
  }

  try {
    const db = getDb();
    
    // Verifica primeiro se o login (e-mail) já existe na base de dados
    db.get('SELECT login FROM cliente WHERE login = ?', [login.trim()], (err, existe) => {
      if (err) {
        console.error('Erro na BD (cadastrarCliente - SELECT):', err);
        return res.status(500).json({ ok: false, erro: 'Erro interno ao validar cliente.' });
      }
      if (existe) {
        return res.status(409).json({ ok: false, erro: 'Este e-mail já está cadastrado. Use outro ou faça login.' });
      }

      const hash = bcrypt.hashSync(senha, SALT_ROUNDS);
      const query = `
        INSERT INTO cliente (login, senha_hash, nome, cpf, nascimento, telefone, estado_civil, escolaridade)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        login.trim(),
        hash,
        nome.trim(),
        cpf.trim(),
        nascimento.trim(),
        (telefone || '').trim(),
        estado_civil || 'solteiro',
        escolaridade || '2g_comp'
      ];

      db.run(query, params, function(insertErr) {
        if (insertErr) {
          console.error('Erro no Insert (cadastrarCliente):', insertErr);
          return res.status(500).json({ ok: false, erro: 'Erro interno ao cadastrar cliente.' });
        }
        return res.status(201).json({ ok: true });
      });
    });
  } catch (err) {
    console.error('cadastrarCliente:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao cadastrar cliente.' });
  }
}

module.exports = { autenticar, trocarSenha, cadastrarCliente };