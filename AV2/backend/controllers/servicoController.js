const { getDb } = require('../config/database');

/**
 * GET /api/servicos
 * Return: { ok: true, dados: [...] } | { ok: false, erro: "..." }
 */
function listarServicos(req, res) {
  try {
    const db = getDb();
    const servicos = db.prepare('SELECT * FROM servico_ti ORDER BY id').all();
    return res.json({ ok: true, dados: servicos });
  } catch (err) {
    console.error('listarServicos:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao consultar serviços.', dados: [] });
  }
}

/**
 * POST /api/servicos
 * Body: { nome, descricao, preco, prazo_dias, icone }
 * Return: { ok: true } | { ok: false, erro: "..." }
 */
function cadastrarServico(req, res) {
  const { nome, descricao, preco, prazo_dias, icone } = req.body;

  if (!nome || preco === undefined || preco === null || !prazo_dias) {
    return res.status(400).json({ ok: false, erro: 'Nome, preço e prazo são obrigatórios.' });
  }

  const precoNum = parseFloat(preco);
  const prazoNum = parseInt(prazo_dias, 10);

  if (isNaN(precoNum) || precoNum <= 0) {
    return res.status(400).json({ ok: false, erro: 'Preço deve ser um número positivo.' });
  }
  if (isNaN(prazoNum) || prazoNum <= 0) {
    return res.status(400).json({ ok: false, erro: 'Prazo deve ser um número inteiro positivo.' });
  }

  try {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO servico_ti (nome, descricao, preco, prazo_dias, icone)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      nome.trim(),
      (descricao || '').trim(),
      precoNum,
      prazoNum,
      (icone || '💻').trim()
    );
    return res.status(201).json({ ok: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('cadastrarServico:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao cadastrar serviço.' });
  }
}

module.exports = { listarServicos, cadastrarServico };