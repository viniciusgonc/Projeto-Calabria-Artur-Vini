const express = require('express');
const cors    = require('cors');
const apiRouter = require('./routes/api');

// Inicializa o banco ao subir o servidor
require('./config/database').getDb();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares globais ───────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────
app.use('/api', apiRouter);

// Health-check
app.get('/', (req, res) => res.json({ status: 'ArtWinners API ok', porta: PORT }));

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ ArtWinners API rodando em http://localhost:${PORT}\n`);
});

module.exports = app;