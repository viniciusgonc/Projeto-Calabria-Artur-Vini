import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader';
import SenhaInput from '../components/SenhaInput';
import AlertaBox  from '../components/AlertaBox';
import { apiCadastrarCliente } from '../services/api';
import { validarEmail } from '../services/validacoes'; // Ajuste o caminho se a sua pasta for 'services' em vez de 'utils'

export default function Cadastro() {
  const navigate = useNavigate();

  // ── Estado ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    login: '',
    senha: '',
    estado_civil: 'solteiro',
    escolaridade: '2g_comp'
  });
  
  const [erros, setErros] = useState({});
  const [alerta, setAlerta] = useState({ msg: '', tipo: 'erro' });
  const [loading, setLoading] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────
  function handleChange(campo, valor) {
    let novoValor = valor;

    if (campo === 'cpf') {
      novoValor = novoValor.replace(/\D/g, ''); // Remove letras
      novoValor = novoValor.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca 1º ponto
      novoValor = novoValor.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca 2º ponto
      novoValor = novoValor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca traço
      if (novoValor.length > 14) return; // Limita a 14 caracteres
    }

    if (campo === 'telefone') {
      novoValor = novoValor.replace(/\D/g, ''); // Remove letras
      novoValor = novoValor.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses no DDD
      novoValor = novoValor.replace(/(\d{5})(\d)/, '$1-$2'); // Coloca traço no número
      if (novoValor.length > 15) return; // Limita a 15 caracteres
    }

    setForm(f => ({ ...f, [campo]: novoValor }));
  }

  // ── Validação Local (Sem manipular DOM) ─────────────────────
  function validar() {
    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = 'O nome é obrigatório.';
    if (!form.cpf.trim()) {
      novosErros.cpf = 'O CPF é obrigatório.';
    } else if (!validarCPF(form.cpf)) {
      novosErros.cpf = 'O CPF informado não é válido.';
    }
    if (!form.nascimento) novosErros.nascimento = 'A data de nascimento é obrigatória.';
    
    if (!form.login.trim()) {
      novosErros.login = 'O e-mail (login) é obrigatório.';
    } else if (!validarEmail(form.login)) {
      novosErros.login = 'Formato de e-mail inválido.';
    }

    if (!form.senha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (form.senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────
  async function handleCadastro() {
    setAlerta({ msg: '', tipo: 'erro' });
    
    if (!validar()) {
      setAlerta({ msg: 'Por favor, preencha todos os campos obrigatórios corretamente.', tipo: 'erro' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await apiCadastrarCliente(form);
      
      if (resultado.ok) {
        alert('Cadastro realizado com sucesso! Agora pode fazer o login.');
        navigate('/login');
      } else {
        setAlerta({ msg: resultado.erro || 'Erro ao realizar o cadastro.', tipo: 'erro' });
      }
    } catch (err) {
      setAlerta({ msg: 'Erro de conexão. Verifique se o servidor backend está a correr.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setForm({
      nome: '', cpf: '', nascimento: '', telefone: '',
      login: '', senha: '', estado_civil: 'solteiro', escolaridade: '2g_comp'
    });
    setErros({});
    setAlerta({ msg: '', tipo: 'erro' });
  }

  // Algoritmo matemático oficial para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove tudo o que não for número
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Bloqueia cpfs como 111.111...
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-main">
        <section className="form-wrapper" aria-label="Formulário de Cadastro" style={{ maxWidth: '600px' }}>
          <div className="auth-logo">
            <span>ArtWinners</span> <span style={{ color: 'var(--brand)' }}>TI</span>
          </div>

          <h1 className="auth-title">Novo Cadastro</h1>
          
          <AlertaBox mensagem={alerta.msg} tipo={alerta.tipo} />

          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="cad-nome">Nome Completo *</label>
              <input
                type="text" id="cad-nome"
                value={form.nome} onChange={e => handleChange('nome', e.target.value)}
                placeholder="Ex: João da Silva"
                className={erros.nome ? 'campo-erro' : ''}
              />
              {erros.nome && <span className="msg-erro">{erros.nome}</span>}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="cad-cpf">CPF *</label>
              <input
                type="text" id="cad-cpf"
                value={form.cpf} onChange={e => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                className={erros.cpf ? 'campo-erro' : ''}
              />
              {erros.cpf && <span className="msg-erro">{erros.cpf}</span>}
            </div>
          </div>

          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="cad-nascimento">Data de Nascimento *</label>
              <input
                type="date" id="cad-nascimento"
                value={form.nascimento} onChange={e => handleChange('nascimento', e.target.value)}
                className={erros.nascimento ? 'campo-erro' : ''}
              />
              {erros.nascimento && <span className="msg-erro">{erros.nascimento}</span>}
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="cad-telefone">Telefone</label>
              <input
                type="tel" id="cad-telefone"
                value={form.telefone} onChange={e => handleChange('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="form-group-inline">
            <div className="form-group form-group-half">
              <label htmlFor="cad-estado">Estado Civil</label>
              <select id="cad-estado" value={form.estado_civil} onChange={e => handleChange('estado_civil', e.target.value)}>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="cad-escolaridade">Escolaridade</label>
              <select id="cad-escolaridade" value={form.escolaridade} onChange={e => handleChange('escolaridade', e.target.value)}>
                <option value="2g_comp">Ensino Médio Completo</option>
                <option value="sup_inc">Ensino Superior Incompleto</option>
                <option value="sup_comp">Ensino Superior Completo</option>
                <option value="pos_grad">Pós-Graduação</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cad-login">E-mail (Login) *</label>
            <input
              type="email" id="cad-login"
              value={form.login} onChange={e => handleChange('login', e.target.value)}
              placeholder="seu@email.com"
              className={erros.login ? 'campo-erro' : ''}
            />
            {erros.login && <span className="msg-erro">{erros.login}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cad-senha">Senha *</label>
            <SenhaInput
              id="cad-senha"
              value={form.senha} onChange={e => handleChange('senha', e.target.value)}
              placeholder="Crie uma senha forte"
              erro={erros.senha}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleCadastro} disabled={loading}>
              {loading ? '⏳ A Registar...' : '✅ Confirmar Registo'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleLimpar}>
              🗑️ Limpar
            </button>
          </div>

          <div className="divider">ou</div>

          <div className="auth-links" style={{ textAlign: 'center' }}>
            Já tem uma conta? <Link to="/login">Faça Login</Link>
            <br /><br />
            <Link to="/">← Voltar à Home</Link>
          </div>
        </section>
      </main>
    </div>
  );
}