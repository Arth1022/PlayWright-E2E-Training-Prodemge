import { test } from '../../../fixtures/nao_autenticado.fixture.js';
import env from '../../../config/env.js';
import { obterUsuarioPorPapel } from '../../../config/usuarios.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import LogoutPage from '../../../support/pages/LogoutPage.js';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import dados from '../../../fixtures/dadosBasicos.json';

test.describe('[logout_sucesso] Testes de Logout', () => {

    test.describe('[operador_logout] Logout com sucesso (operador)', () => {

        test.beforeEach(async ({ nao_autenticado }) => {
            // teste de logout inicia sem sessao salva, entao o login e feito pelo flow
            const operador = obterUsuarioPorPapel('operador');
            const loginFlows = new LoginFlows(nao_autenticado);
            await loginFlows.realizarLoginOrangeHRM(operador.cpf, operador.senha);
        });

        test('[CT_#0003] Logout com sucesso (operador)', async ({ nao_autenticado }) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                LOGOUT COM SUCESSO PELO USUÁRIO operador`);

            const { informacao } = dados;
            const comunsPage = new ComunsPage(nao_autenticado);
            const logoutPage = new LogoutPage(nao_autenticado);

            await comunsPage.garantirTelaCarregada();
            await logoutPage.abrirMenuUsuario();
            await logoutPage.clicarLogout();
            await comunsPage.validarUrlAcessada(env.urlLogout);
            await logoutPage.validarTituloTelaLogin(informacao.login);
        });
    });
});
