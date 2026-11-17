/**
 * Configuração centralizada de usuários por papel
 * 
 * USUARIOS_POR_PAPEL -> Cadastrar os dados de cada papel
 * CPF e nome devem ser usuários reais e ativos no sistema
 */
const USUARIOS_POR_PAPEL = Object.freeze({
    operador: {
        cpf: 'Admin', // inserir CPF válido de usuário ativo no sistema
        senha: 'admin123', // inserir senha válida do usuário ativo no sistema
        nome: 'UserName', // inserir nome real do usuário ativo no sistema
    },
    /* PARA NOVOS PAPEIS, DESCOMENTE E PREENCHA OS DADOS ABAIXO DE ACORDO COM O SISTEMA
    financeiro: {
        cpf: '',
        senha: '', 
        nome: '', 
    },
    gestor: {
        cpf: '', 
        senha: '', 
        nome: '',
    },
    */
});

/**
 * Papel autenticado padrão, usado quando PAPEL_AUTENTICADO não é informado
 */
const PAPEL_AUTENTICADO_PADRAO = 'operador';

/**
 * Retorna lista de papéis disponíveis
 * Exemplo: ['avaliador', 'ouvidor', 'atendente', 'gestor']
 */
export function obterPapeisDisponiveis() {
    return Object.keys(USUARIOS_POR_PAPEL);
}

/**
 * Resolve o papel a autenticar a partir de variável de ambiente
 * 
 * Leitura:
 * 1. Obtém valor de process.env.PAPEL_AUTENTICADO ou usa PAPEL_AUTENTICADO_PADRAO
 * 2. Normaliza (trim, toLowerCase)
 * 3. Valida se existe em USUARIOS_POR_PAPEL
 * 
 * Exemplos:
 * - PAPEL_AUTENTICADO=GESTOR → 'gestor'
 * - PAPEL_AUTENTICADO=atendente → 'atendente'
 * - (não informado) → 'atendente' (padrão)
 */
export function obterPapelAutenticado() {
    const papelInformado = process.env.PAPEL_AUTENTICADO || PAPEL_AUTENTICADO_PADRAO;
    const papel = papelInformado.trim().toLowerCase();

    if (!USUARIOS_POR_PAPEL[papel]) {
        throw new Error(
            `PAPEL_AUTENTICADO inválido: "${papel}". Valores aceitos: ${obterPapeisDisponiveis().join(', ')}`
        );
    }

    return papel;
}

/**
 * Retorna dados completos do usuário para um papel
 * 
 * Exemplo de retorno:
 * {
 *   papel: 'gestor',
 *   cpf: '00000000000',
 *   nome: 'TESTE AUTOMATIZADO NOME_APLICACAO LARANJA'
 * }
 */
export function obterUsuarioPorPapel(papel = obterPapelAutenticado()) {
    const papelNormalizado = papel.trim().toLowerCase();
    const usuario = USUARIOS_POR_PAPEL[papelNormalizado];

    if (!usuario) {
        throw new Error(`Usuário não encontrado para o papel "${papel}".`);
    }

    return {
        papel: papelNormalizado,
        cpf: usuario.cpf,
        nome: usuario.nome,
        senha: usuario.senha
    };
}

/**
 * Retorna o objeto USUARIOS_POR_PAPEL completo
 * 
 * Usado para:
 * - Listar todos os papéis e seus dados em validar-autenticacao.mjs
 * - Iterar sobre papéis em testes parametrizados
 */
export function obterUsuarios() {
    return USUARIOS_POR_PAPEL;
}

/**
 * Gera o caminho do arquivo storageState para um papel e módulo
 * 
 * Exemplos:
 * - obterCaminhoArmazenamentoEstado('empolp', 'operador') -> 'storageState-empolp-operador.json'
 * 
 * Cada papel possui seu próprio arquivo de sessão, reutilizável entre testes
 */
export function obterCaminhoArmazenamentoEstado(modulo, papel = obterPapelAutenticado()) {
    return `storageState-${modulo}-${papel}.json`;
}

/**
 * Este arquivo é a fonte única de verdade para:
 * - Papéis disponíveis no sistema 
 * - CPF de cada usuário de teste
 * - Nome de cada usuário de teste
 * 
 * Usado por:
 * - global-setup.js: Para autenticar o usuário do papel escolhido
 * - fixtures/usuario_autenticado.fixture.js: Para expor papelAutenticado nos testes
 * - validar-autenticacao.mjs: Para validar a configuração
 * - e2e/*.spec.js: Para aplicar filtros por papel
 * 
 * Variável de ambiente: PAPEL_AUTENTICADO
 */