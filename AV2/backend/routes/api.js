const express = require('express');
const router = express.Router();

const { autenticar, trocarSenha, cadastrarCliente } = require('../controllers/clienteController');
const { listarServicos, cadastrarServico }           = require('../controllers/servicoController');
const { listarSolicitacoes, atualizarSolicitacoes } = require('../controllers/solicitacaoController');

// ── Auth ──────────────────────────────────────────────────────
router.post('/auth/login',        autenticar);
router.post('/auth/trocar-senha', trocarSenha);

// ── Clientes ──────────────────────────────────────────────────
router.post('/clientes', cadastrarCliente);

// ── Serviços de TI ────────────────────────────────────────────
router.get('/servicos',  listarServicos);
router.post('/servicos', cadastrarServico);

// ── Solicitações ──────────────────────────────────────────────
router.get('/solicitacoes/:login', listarSolicitacoes);
router.put('/solicitacoes',        atualizarSolicitacoes);

module.exports = router;