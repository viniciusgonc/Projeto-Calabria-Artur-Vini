const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// ── Inicialização ────────────────────────────────────────────────
firebase.initializeApp(firebaseConfig);

/** Instância do Firestore */
const db = firebase.firestore();

/** Instância do Auth */
const fbAuth = firebase.auth();

// Persistência de sessão: mantém o login enquanto a aba estiver aberta
fbAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .catch(err => console.warn('Erro ao definir persistência:', err));

// ── Helpers do Firestore ─────────────────────────────────────────

/**
 * Salva o perfil do usuário no Firestore.
 * @param {string} uid - UID do usuário autenticado
 * @param {object} dados - Dados do perfil
 */
async function salvarPerfil(uid, dados) {
  await db.collection('usuarios').doc(uid).set({
    ...dados,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/**
 * Busca o perfil do usuário no Firestore.
 * @param {string} uid
 * @returns {object|null}
 */
async function buscarPerfil(uid) {
  const doc = await db.collection('usuarios').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

/**
 * Adiciona uma solicitação de serviço ao Firestore.
 * @param {string} uid
 * @param {object} solicitacao
 */
async function adicionarSolicitacao(uid, solicitacao) {
  await db
    .collection('solicitacoes')
    .doc(uid)
    .collection('itens')
    .add({
      ...solicitacao,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
}

/**
 * Exclui uma solicitação do Firestore.
 * @param {string} uid
 * @param {string} docId - ID do documento no Firestore
 */
async function excluirSolicitacaoFS(uid, docId) {
  await db
    .collection('solicitacoes')
    .doc(uid)
    .collection('itens')
    .doc(docId)
    .delete();
}

/**
 * Retorna um listener em tempo real das solicitações do usuário.
 * @param {string} uid
 * @param {function} callback - Chamado sempre que os dados mudarem
 * @returns {function} Função para cancelar o listener (unsubscribe)
 */
function ouvirSolicitacoes(uid, callback) {
  return db
    .collection('solicitacoes')
    .doc(uid)
    .collection('itens')
    .orderBy('data', 'asc')
    .onSnapshot(snapshot => {
      const itens = [];
      snapshot.forEach(doc => {
        itens.push({ _docId: doc.id, ...doc.data() });
      });
      callback(itens);
    }, err => {
      console.error('Erro ao ouvir solicitações:', err);
      callback([]);
    });
}
