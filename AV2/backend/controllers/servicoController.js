const { getDb } = require('../config/database');

function listarServicos(req, res) {
  try {
    const db = getDb();
    db.all('SELECT * FROM servico_ti ORDER BY id', [], (err, servicos) => {
      if (err) {
        console.error('listarServicos:', err);
        return res.status(500).json({ ok: false, erro: 'Erro interno ao consultar serviços.', dados: [] });
      }
      return res.json({ ok: true, dados: servicos });
    });
  } catch (err) {
    console.error('listarServicos:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno.', dados: [] });
  }
}

function cadastrarServico(req, res) {
  const { nome, descricao, preco, prazo_dias, icone } = req.body;

  if (!nome || preco === undefined || preco === null || !prazo_dias) {
    return res.status(400).json({ ok: false, erro: 'Nome, preço e prazo são obrigatórios.' });
  }

  const precoNum = parseFloat(preco);
  const prazoNum = parseInt(prazo_dias, 10);

  if (isNaN(precoNum) || precoNum <= 0) return res.status(400).json({ ok: false, erro: 'Preço inválido.' });
  if (isNaN(prazoNum) || prazoNum <= 0) return res.status(400).json({ ok: false, erro: 'Prazo inválido.' });

  try {
    const db = getDb();
    const query = `INSERT INTO servico_ti (nome, descricao, preco, prazo_dias, icone) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome.trim(), (descricao || '').trim(), precoNum, prazoNum, (icone || '💻').trim()], function(err) {
      if (err) {
        console.error('cadastrarServico:', err);
        return res.status(500).json({ ok: false, erro: 'Erro ao cadastrar serviço.' });
      }
      return res.status(201).json({ ok: true, id: this.lastID });
    });
  } catch (err) {
    console.error('cadastrarServico:', err);
    return res.status(500).json({ ok: false, erro: 'Erro interno.' });
  }
}

module.exports = { listarServicos, cadastrarServico };