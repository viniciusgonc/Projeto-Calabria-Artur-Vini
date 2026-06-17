// AV2/backend/config/database.js
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../artwinners.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    console.log('✅ Banco SQLite conectado em:', DB_PATH);
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cliente (
      login       TEXT PRIMARY KEY,
      senha_hash  TEXT NOT NULL,
      nome        TEXT NOT NULL,
      cpf         TEXT NOT NULL,
      nascimento  TEXT NOT NULL,
      telefone    TEXT,
      estado_civil TEXT NOT NULL DEFAULT 'solteiro',
      escolaridade TEXT NOT NULL DEFAULT '2g_comp',
      criado_em   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS servico_ti (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL,
      descricao  TEXT,
      preco      REAL NOT NULL,
      prazo_dias INTEGER NOT NULL,
      icone      TEXT DEFAULT '💻'
    );

    CREATE TABLE IF NOT EXISTS solicitacao (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      login_cliente  TEXT NOT NULL,
      servico_id     INTEGER NOT NULL,
      data_pedido    TEXT NOT NULL DEFAULT (date('now')),
      data_prevista  TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'EM ELABORAÇÃO',
      criado_em      TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(login_cliente) REFERENCES cliente(login)    ON DELETE CASCADE,
      FOREIGN KEY(servico_id)    REFERENCES servico_ti(id)    ON DELETE RESTRICT
    );
  `);

  // Seed inicial de serviços
  const { n } = db.prepare('SELECT COUNT(*) as n FROM servico_ti').get();
  if (n === 0) {
    const ins = db.prepare(
      'INSERT INTO servico_ti (nome, descricao, preco, prazo_dias, icone) VALUES (?, ?, ?, ?, ?)'
    );
    [
      ['Desenvolvimento de Software Sob Medida', 'Sistemas web, mobile e desktop.',  8000, 30, '💻'],
      ['Suporte Técnico Especializado',          'Atendimento remoto e presencial.',   600,  3, '🛠️'],
      ['Segurança da Informação',                'Auditoria de segurança e LGPD.',    4500, 20, '🛡️'],
    ].forEach(row => ins.run(...row));
    console.log('🌱 Seed de serviços inserido!');
  }
}

module.exports = { getDb };