const { getDb } = require('../config/database');

/**
 * GET /api/solicitacoes/:login
 * Return: { ok: true, dados: [...] } | { ok: false, erro: "..." }
 */
function listarSolicitacoes(req, res) {
  const { login } = req.params;
  if (!login) {
    return res.status(400).json({ ok: false, erro: 'Login do usuário é obrigatório.', dados: [] });
  }

  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT
        s.id,
        s.login_cliente,
        s.servico_id,
        st.nome        AS servico_nome,
        st.preco       AS preco,
        st.icone       AS icone,
        s.data_pedido,
        s.data_prevista,
        s.status
      FROM solicitacao s
      JOIN servico_ti st ON st.id = s.servico_id
      WHERE s.login_cliente = ?
      ORDER BY s.data_pedido ASC, s.id ASC
    `).all(login.trim());

    return res.json({ ok: true, dados: rows });
  } catch (err) {
    console.error('listarSolicitacoes:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao consultar solicitações.', dados: [] });
  }
}

/**
 * PUT /api/solicitacoes
 * Body: { login, solicitacoes: [{ servico_id, data_pedido, data_prevista, status }, ...] }
 * Apaga todas as solicitações atuais do usuário e insere as novas.
 * Return: { ok: true } | { ok: false, erro: "..." }
 */
function atualizarSolicitacoes(req, res) {
  const { login, solicitacoes } = req.body;

  if (!login) {
    return res.status(400).json({ ok: false, erro: 'Login do usuário é obrigatório.' });
  }
  if (!Array.isArray(solicitacoes)) {
    return res.status(400).json({ ok: false, erro: 'Campo "solicitacoes" deve ser um array.' });
  }

  try {
    const db = getDb();

    // Verifica se o cliente existe
    const cliente = db.prepare('SELECT 1 FROM cliente WHERE login = ?').get(login.trim());
    if (!cliente) {
      return res.status(404).json({ ok: false, erro: 'Cliente não encontrado.' });
    }

    const deleteStmt = db.prepare('DELETE FROM solicitacao WHERE login_cliente = ?');
    const insertStmt = db.prepare(`
      INSERT INTO solicitacao (login_cliente, servico_id, data_pedido, data_prevista, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const updateTransaction = db.transaction(() => {
      deleteStmt.run(login.trim());
      for (const sol of solicitacoes) {
        if (!sol.servico_id || !sol.data_pedido || !sol.data_prevista) {
          throw new Error('Cada solicitação precisa de servico_id, data_pedido e data_prevista.');
        }
        insertStmt.run(
          login.trim(),
          sol.servico_id,
          sol.data_pedido,
          sol.data_prevista,
          sol.status || 'EM ELABORAÇÃO'
        );
      }
    });

    updateTransaction();
    return res.json({ ok: true });
  } catch (err) {
    console.error('atualizarSolicitacoes:', err);
    return res.status(500).json({ ok: false, erro: err.message || 'Erro interno ao atualizar solicitações.' });
  }
}

module.exports = { listarSolicitacoes, atualizarSolicitacoes };