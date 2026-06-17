const { getDb } = require('../config/database');

function listarSolicitacoes(req, res) {
  const { login } = req.params;
  if (!login) return res.status(400).json({ ok: false, erro: 'Login do usuário é obrigatório.', dados: [] });

  try {
    const db = getDb();
    const query = `
      SELECT s.id, s.login_cliente, s.servico_id, st.nome AS servico_nome,
             st.preco AS preco, st.icone AS icone, s.data_pedido, s.data_prevista, s.status
      FROM solicitacao s
      JOIN servico_ti st ON st.id = s.servico_id
      WHERE s.login_cliente = ?
      ORDER BY s.data_pedido ASC, s.id ASC
    `;
    db.all(query, [login.trim()], (err, rows) => {
      if (err) {
        console.error('listarSolicitacoes:', err);
        return res.status(500).json({ ok: false, erro: 'Erro ao consultar.', dados: [] });
      }
      return res.json({ ok: true, dados: rows });
    });
  } catch (err) {
    console.error('listarSolicitacoes:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno.', dados: [] });
  }
}

function atualizarSolicitacoes(req, res) {
  const { login, solicitacoes } = req.body;

  if (!login) return res.status(400).json({ ok: false, erro: 'Login é obrigatório.' });
  if (!Array.isArray(solicitacoes)) return res.status(400).json({ ok: false, erro: 'solicitacoes deve ser array.' });

  try {
    const db = getDb();
    db.get('SELECT 1 FROM cliente WHERE login = ?', [login.trim()], (err, cliente) => {
      if (err) return res.status(500).json({ ok: false, erro: 'Erro na BD.' });
      if (!cliente) return res.status(404).json({ ok: false, erro: 'Cliente não encontrado.' });

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run('DELETE FROM solicitacao WHERE login_cliente = ?', [login.trim()]);
        
        const stmt = db.prepare(`INSERT INTO solicitacao (login_cliente, servico_id, data_pedido, data_prevista, status) VALUES (?, ?, ?, ?, ?)`);
        
        for (const sol of solicitacoes) {
          stmt.run(login.trim(), sol.servico_id, sol.data_pedido, sol.data_prevista, sol.status || 'EM ELABORAÇÃO');
        }
        stmt.finalize();
        
        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
             console.error('Erro no commit:', commitErr);
             db.run('ROLLBACK');
             return res.status(500).json({ ok: false, erro: 'Erro ao salvar solicitações.' });
          }
          return res.json({ ok: true });
        });
      });
    });
  } catch (err) {
    console.error('atualizarSolicitacoes:', err);
    return res.status(500).json({ ok: false, erro: err.message });
  }
}

module.exports = { listarSolicitacoes, atualizarSolicitacoes };