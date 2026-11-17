import { test } from '../../../fixtures/nao_autenticado.fixture.js';
import env from '../../../config/env.js';
import { obterUsuarioPorPapel } from '../../../config/usuarios.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import LoginPage from '../../../support/pages/LoginPage.js';
import LogoutPage from '../../../support/pages/LogoutPage.js';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import dados from '../../../fixtures/dadosBasicos.json';

test.describe('[logout_insucesso] Testes de Logout', () => {

    test.describe('[operador_logout] Acesso negado após logout (operador)', () => {

        test.beforeEach(async ({ nao_autenticado }) => {
            // teste de logout inicia sem sessao salva, entao o login e feito pelo flow
            const operador = obterUsuarioPorPapel('operador');
            const loginFlows = new LoginFlows(nao_autenticado);
            await loginFlows.realizarLoginOrangeHRM(operador.cpf, operador.senha);
        });

        test('[CT_#0004] Acessar URL do dashboard após logout retorna para a tela de login', async ({ nao_autenticado }) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                APÓS O LOGOUT, TENTA ABRIR A URL DO DASHBOARD DIRETO PELO NAVEGADOR
                E VALIDA QUE O SITE PERMANECE NA TELA DE LOGIN`);

            const { informacao } = dados;
            const comunsPage = new ComunsPage(nao_autenticado);
            const loginPage = new LoginPage(nao_autenticado);
            const logoutPage = new LogoutPage(nao_autenticado);

            await comunsPage.garantirTelaCarregada();
            await logoutPage.abrirMenuUsuario();
            await logoutPage.clicarLogout();
            // garante que a tela de login carregou antes de tentar a url autenticada
            await logoutPage.garantirTelaLoginCarregada();
            await loginPage.abrirUrl(env.urlAutenticadaOrange);
            await comunsPage.validarUrlAcessada(env.urlLogout);
            await logoutPage.validarTituloTelaLogin(informacao.login);
        });
    });
});
