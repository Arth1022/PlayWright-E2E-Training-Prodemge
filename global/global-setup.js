import { chromium } from '@playwright/test';
import LoginFlows from '../support/flows/LoginFlows.js';
import env from '../config/env.js';
import { obterUsuarioPorPapel } from '../config/usuarios.js';
import dados from '../fixtures/dadosBasicos.json';

// Define os papéis e o método de login usado para criar a sessão de cada um.
// O método indica em qual módulo aquele papel tem acesso para autenticar.
// Novos papéis: adicione aqui com o método de login correto.
const papeis = [
    { nome: 'operador',   modulo: 'orangeHRM',  login: (flows, cpf, senha) => flows.realizarLoginOrangeHRM(cpf, senha) },
];

// Realiza login uma única vez por papel e salva storageState separado.
// Ex: storageState-testeInteg-operador.json, storageState-testeInteg-financeiro.json
async function globalSetup() {
    const isCI = process.env.CI === 'true';
    // const isUIMode = process.env.UI_MODE === 'true';

    for (const papel of papeis) {
        // Global-setup SEMPRE roda em headless (sem abrir navegador)
        // O UI mode será aplicado apenas aos testes, não ao setup
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ ignoreHTTPSErrors: !!process.env.CI });
        const page = await context.newPage();

        const loginFlows = new LoginFlows(page);
        const usuario = obterUsuarioPorPapel(papel.nome);

        console.log(`[global-setup] Autenticando papel "${papel.nome}" (${usuario.nome})`);

        await papel.login(loginFlows, usuario.cpf, usuario.senha);

        const path = `storageState-${papel.modulo}-${papel.nome}.json`;
        await context.storageState({ path });
        await browser.close();

        console.log(`[global-setup] Sessão salva: ${path}`);
    }
}
export default globalSetup;