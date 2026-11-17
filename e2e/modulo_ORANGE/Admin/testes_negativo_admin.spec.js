import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import dados from '../../../fixtures/dadosBasicos.json';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import PimFlows from '../../../support/flows/PimFlows.js';

test.describe('[admin_negativo] Testes tela Admin', () => {

    test.describe('[admin_usuario_senha_invalida] Cadastro de usuario com senha invalida (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // cria no PIM o funcionário usado no cadastro, para que a senha seja o único dado inválido do formulário
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // o usuário não chega a ser criado, então remove apenas o funcionário criado como pré-condição
            const codigoUnico = testInfo['codigoUnico'];
            const pimFlows = new PimFlows(page);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0011] Adicionar usuário com senha inválida', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                TENTA CADASTRAR NO ADMIN UM USUÁRIO COM TODOS OS DADOS VÁLIDOS, EXCETO A SENHA COM MENOS DE 7
                CARACTERES, E VALIDA A MENSAGEM DA REGRA DE SENHA VIOLADA`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, mensagem, campo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            const codigoUnico = testInfo['codigoUnico'];
            const nomeCompleto = `${pessoa.joao} ${pessoa.pereira} ${pessoa.santos}`;

            await comunsPage.selecionarOpcaoMenu(opcao.admin);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addUser);

            await comunsPage.abrirDropdown(campo.userRole);
            await comunsPage.selecionarOpcaoDropdown(opcao.ess);
            await comunsPage.preencherCampoComTexto(campo.employeeName, codigoUnico);
            await comunsPage.selecionarOpcaoDropdown(nomeCompleto);
            await comunsPage.abrirDropdown(campo.status);
            await comunsPage.selecionarOpcaoDropdown(opcao.enabled);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.preencherCampoComTexto(campo.password, informacao.senhaMenorQue7Caracteres);
            await comunsPage.preencherCampoComTexto(campo.confirmPassword, informacao.senhaMenorQue7Caracteres);

            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemErroNoCampo(campo.password, mensagem.senhaMinimo7Caracteres);
            // o cadastro não pode ser concluído, permanece na tela de Add User
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addUser);
        });
    });
});
