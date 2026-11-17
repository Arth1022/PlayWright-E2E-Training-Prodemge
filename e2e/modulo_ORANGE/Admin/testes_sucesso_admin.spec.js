import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import dados from '../../../fixtures/dadosBasicos.json';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import PimFlows from '../../../support/flows/PimFlows.js';
import AdminFlows from '../../../support/flows/AdminFlows.js';

test.describe('[admin_sucesso] Testes tela Admin', () => {

    test.describe('[admin_usuario_cadastro] Cadastro de usuario pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // cria no PIM o funcionário que será vinculado ao usuário cadastrado no teste
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remover o funcionário também remove o usuário vinculado a ele (exclusão em cascata no OrangeHRM)
            const codigoUnico = testInfo['codigoUnico'];
            const pimFlows = new PimFlows(page);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0008] Adicionar usuário com dados completos', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                CADASTRA NO ADMIN UM USUÁRIO VINCULADO A UM FUNCIONÁRIO CRIADO PELO TESTE NO PIM, PREENCHENDO
                TODOS OS DADOS OBRIGATÓRIOS E VALIDA O REGISTRO NA LISTAGEM APÓS PESQUISA`);
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
            await comunsPage.validarValorCampo(campo.employeeName, nomeCompleto);
            await comunsPage.abrirDropdown(campo.status);
            await comunsPage.selecionarOpcaoDropdown(opcao.enabled);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.preencherCampoComTexto(campo.password, informacao.senhaValida);
            await comunsPage.preencherCampoComTexto(campo.confirmPassword, informacao.senhaValida);

            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemTemporaria(mensagem.successfullySaved);
            await comunsPage.garantirTelaCarregada();

            await comunsPage.selecionarOpcaoMenu(opcao.admin);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(codigoUnico);
            await comunsPage.validarInformacaoNaLista(opcao.ess);
            await comunsPage.validarInformacaoNaLista(`${pessoa.joao} ${pessoa.santos}`);
            await comunsPage.validarInformacaoNaLista(opcao.enabled);
        });
    });

    test.describe('[admin_usuario_edicao] Edicao de usuario criado pelo teste (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            const adminFlows = new AdminFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // pré-condição completa: funcionário criado no PIM e usuário vinculado a ele criado no Admin
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
            await adminFlows.cadastrarUsuario(codigoUnico);
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remover o funcionário também remove o usuário vinculado a ele (exclusão em cascata no OrangeHRM)
            const codigoUnico = testInfo['codigoUnico'];
            const pimFlows = new PimFlows(page);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0009] Editar dados do usuário', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                ALTERA ROLE, STATUS E SENHA DE UM USUÁRIO CRIADO PELO TESTE E VALIDA OS DADOS ALTERADOS
                NA LISTAGEM APÓS PESQUISA`);
            test.skip(papelAutenticado !== 'operador');
            const { opcao, botao, mensagem, campo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            const codigoUnico = testInfo['codigoUnico'];

            await comunsPage.selecionarOpcaoMenu(opcao.admin);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.clicarEditarNaLinha(codigoUnico);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.editUser);

            await comunsPage.abrirDropdown(campo.userRole);
            await comunsPage.selecionarOpcaoDropdown(opcao.admin);
            await comunsPage.abrirDropdown(campo.status);
            await comunsPage.selecionarOpcaoDropdown(opcao.disabled);
            await comunsPage.marcarCheckbox(campo.changePassword);
            await comunsPage.preencherCampoComTexto(campo.password, informacao.novaSenhaValida);
            await comunsPage.preencherCampoComTexto(campo.confirmPassword, informacao.novaSenhaValida);
            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemTemporaria(mensagem.successfullyUpdated);
            await comunsPage.garantirTelaCarregada();

            await comunsPage.selecionarOpcaoMenu(opcao.admin);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(codigoUnico);
            await comunsPage.validarInformacaoNaLista(opcao.admin);
            await comunsPage.validarInformacaoNaLista(opcao.disabled);
            await comunsPage.validarInformacaoNaoEstaNaLista(opcao.ess);
            await comunsPage.validarInformacaoNaoEstaNaLista(opcao.enabled);
        });
    });

    test.describe('[admin_usuario_exclusao] Exclusao de usuario criado pelo teste (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            const adminFlows = new AdminFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // pré-condição completa: funcionário criado no PIM e usuário vinculado a ele criado no Admin
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
            await adminFlows.cadastrarUsuario(codigoUnico);
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // o teste exclui somente o usuário, o funcionário criado como pré-condição continua no PIM e precisa ser removido
            const codigoUnico = testInfo['codigoUnico'];
            const pimFlows = new PimFlows(page);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0010] Remover usuário', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                REMOVE UM USUÁRIO CRIADO PELO TESTE, VALIDA A CONFIRMAÇÃO DE EXCLUSÃO E A SAÍDA DA LISTAGEM`);
            test.skip(papelAutenticado !== 'operador');
            const { opcao, botao, mensagem, campo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            const codigoUnico = testInfo['codigoUnico'];

            await comunsPage.selecionarOpcaoMenu(opcao.admin);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
            await comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(codigoUnico);

            await comunsPage.clicarExcluirNaLinha(codigoUnico);
            await comunsPage.validarModal(informacao.areYouSure);
            await comunsPage.clicarBotaoModal(botao.yesDelete);

            await comunsPage.validarMensagemTemporaria(mensagem.successfullyDeleted);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaoEstaNaLista(codigoUnico);
        });
    });
});
