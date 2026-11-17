import { test, expect } from '../../fixtures/usuario_autenticado.fixture.js';
import LoginFlows from '../../support/flows/LoginFlows.js';
import HelpersPage from '../../support/pages/HelpersPage.js';
import ComunsPage from '../../support/pages/ComunsPage.js';
import { obterUsuarioPorPapel } from '../../config/usuarios.js';
import dados from '../../fixtures/dadosBasicos.json';

test.describe('[limpeza] Limpeza de ambiente', () => {

    // para o teste limpeza funcionar, precisa ter o dado contendo o nome 'Playwright' criado previamente, 
    // para que seja possível localizar e excluir o dado.
    // nesse caso não se cria variável em dados básicos, pois o teste de limpeza roda em situações específicas
    // e normalmente fazemos a chamada manualmente, podendo rodar mais de uma vez, quando necessário
    let nomeDadoCriadoParaExcluir = 'Playwright';

    test.describe('[limpeza_dado] Limpeza de dado criado por teste', () => {

        test.beforeEach(async ({ page, papelAutenticado }) => {
            const loginFlows = new LoginFlows(page);
            //escolher um usuário que tenha permissão ampla de acesso ao sistema, 
            // para conseguir localizar e excluir o dado criado por teste.
            test.skip(papelAutenticado !== 'operador');
            await loginFlows.entrarUrlAutenticadaOrange();
        });

        test('[CT_#NNN] Excluir dado criado por teste', async ({ page, papelAutenticado }) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                EXCLUI DADO CRIADO POR TESTE, LOCALIZANDO PELO NOME DO DADO QUE CONTENHA "Playwright"`);

            test.skip(papelAutenticado !== 'operador');

            // Seguir mesmo padrão, instanciar classes e chamar métodos
            // para realizar ações de limpeza de dado criado
        });
    });
});