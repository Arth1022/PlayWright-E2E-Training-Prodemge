import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import HelpersPage from '../../../support/pages/HelpersPage.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import PimPage from '../../../support/pages/modulo_ORANGE/PimPage.js';
import PimFlows from '../../../support/flows/PimFlows.js';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import dados from '../../../fixtures/dadosBasicos.json';

test.describe('[pim_sucesso] Testes tela PIM', () => {

    test.describe('[pim_funcionario_cadastro] Cadastro de funcionario pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // recebe o codigo armazenado no corpo do teste e remove o funcionario criado
            const codigoUnico = testInfo['codigoUnico'];
            const pimFlows = new PimFlows(page);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0005] Adicionar funcionario', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️ 
                CADASTRA UM FUNCIONÁRIO NO PIM COM FOTO DE PERFIL E VALIDA O REGISTRO NA LISTAGEM`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, arquivo, mensagem, campo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            const helpersPage = new HelpersPage(page);
            const pimPage = new PimPage(page);
            const primeiroESegundoNome = `${pessoa.joao} ${pessoa.pereira}`;
            const codigoUnico = helpersPage.gerarCodigoAleatorio_abc12345();
            // salva o codigo para transportar para o afterEach
            testInfo['codigoUnico'] = codigoUnico;

            await comunsPage.selecionarOpcaoMenu(opcao.pim);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.preencherNome(campo.firstName, pessoa.joao);
            await comunsPage.preencherNome(campo.middleName, pessoa.pereira);
            await comunsPage.preencherNome(campo.lastName, pessoa.santos);
            await comunsPage.preencherCampoComTexto(campo.employeeId, codigoUnico);
            await pimPage.inserirFotoDePerfil(arquivo.imagemJPGTestePath);
            const dimensoesFotoPerfil = await pimPage.validarFotoDePerfilECapturarDimensoes(informacao.fotoPerfil);
            await helpersPage.validarDimensoesImagem(dimensoesFotoPerfil, arquivo.limite200pxLarguraImg, arquivo.limite200pxAlturaImg, informacao.fotoPerfil);
            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemTemporaria(mensagem.succesfullySaved);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.selecionarOpcaoMenu(opcao.pim);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
            await comunsPage.preencherCampoComTexto(campo.employeeId, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(codigoUnico);
            await comunsPage.validarInformacaoNaLista(primeiroESegundoNome);
            await comunsPage.validarInformacaoNaLista(pessoa.santos);
        });
    });

    test.describe('[pim_funcionario_exclusao] Exclusao de funcionario pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            // salva o codigo para transportar para o corpo do teste
            testInfo['codigoUnico'] = codigoUnico;
        });

        test('[CT_#0006] Remover funcionario', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️ 
                REMOVE UM FUNCIONÁRIO PREVIAMENTE CADASTRADO E VALIDA A SAÍDA DA LISTAGEM`);
            test.skip(papelAutenticado !== 'operador');
            const { opcao, botao, mensagem, campo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            // recebe o codigo do funcionario cadastrado no beforeEach
            const codigoUnico = testInfo['codigoUnico'];

            await comunsPage.selecionarOpcaoMenu(opcao.pim);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
            await comunsPage.preencherCampoComTexto(campo.employeeId, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(codigoUnico);

            await comunsPage.clicarExcluirNaLinha(codigoUnico);
            await comunsPage.validarModal(informacao.areYouSure);
            await comunsPage.clicarBotaoModal(botao.yesDelete);
            await comunsPage.validarMensagemTemporaria(mensagem.succesfullyDeleted);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaoEstaNaLista(codigoUnico);
        });
    });
});