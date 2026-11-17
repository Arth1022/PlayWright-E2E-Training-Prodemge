import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import dados from '../../../fixtures/dadosBasicos.json';

test.describe('[pim_negativo] Testes tela PIM', () => {

    test.describe('[pim_funcionario_obrigatoriedade] Obrigatoriedade no cadastro de funcionario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
        });

        test('[CT_#0007] Adicionar funcionario sem informar dados obrigatorios', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️ 
                TENTA CADASTRAR UM FUNCIONÁRIO SEM INFORMAR OS CAMPOS OBRIGATÓRIOS E VALIDA A
                MENSAGEM DE OBRIGATORIEDADE EM FIRST NAME E LAST NAME`);
            test.skip(papelAutenticado !== 'operador');
            const { opcao, botao, mensagem, campo } = dados;
            const comunsPage = new ComunsPage(page);

            await comunsPage.selecionarOpcaoMenu(opcao.pim);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addEmployee);

            // Tentar salvar sem preencher nenhum campo
            await comunsPage.clicarBotao(botao.save);

            // Validar obrigatoriedade nos campos First Name e Last Name
            await comunsPage.validarMensagemErroNoNome(campo.firstName, mensagem.required);
            await comunsPage.validarMensagemErroNoNome(campo.lastName, mensagem.required);

            // O cadastro nao pode ser concluido, permanece na tela de Add Employee
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addEmployee);
        });
    });
});