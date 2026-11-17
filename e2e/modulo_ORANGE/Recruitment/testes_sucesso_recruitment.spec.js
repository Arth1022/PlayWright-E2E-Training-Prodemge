import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import dados from '../../../fixtures/dadosBasicos.json';
import LoginFlows from '../../../support/flows/LoginFlows.js';
import PimFlows from '../../../support/flows/PimFlows.js';
import RecruitmentFlows from '../../../support/flows/RecruitmentFlows.js';

test.describe('[recruitment_sucesso] Testes tela Recruitment', () => {

    test.describe('[recruitment_vaga_cadastro] Cadastro de vaga pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // cria no PIM o funcionario que sera o Hiring Manager da vaga
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remove a vaga criada no teste e depois o funcionario usado como Hiring Manager
            const codigoUnico = testInfo['codigoUnico'];
            const nomeVaga = testInfo['nomeVaga'];
            const recruitmentFlows = new RecruitmentFlows(page);
            const pimFlows = new PimFlows(page);
            await recruitmentFlows.removerVaga(nomeVaga);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0012] Criar Vacancy com dados mínimos', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                CADASTRA UMA VAGA NO RECRUITMENT INFORMANDO SOMENTE OS CAMPOS OBRIGATÓRIOS, COM UM FUNCIONÁRIO
                CRIADO PELO TESTE NO PIM COMO HIRING MANAGER`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, campo, mensagem } = dados;
            const comunsPage = new ComunsPage(page);
            const codigoUnico = testInfo['codigoUnico'];
            const nomeCompleto = `${pessoa.joao} ${pessoa.pereira} ${pessoa.santos}`;
            const nomeVaga = `${codigoUnico} ${mensagem.testeAutomatizadoPlaywright}`;
            // salva o nome da vaga para transportar para o afterEach
            testInfo['nomeVaga'] = nomeVaga;

            await comunsPage.selecionarOpcaoMenu(opcao.recruitment);
            await comunsPage.selecionarAbaMenuSuperior(opcao.vacancies);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.vacancies);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addVacancy);

            await comunsPage.preencherCampoComTexto(campo.vacancyName, nomeVaga);
            await comunsPage.abrirDropdown(campo.jobTitle);
            await comunsPage.selecionarOpcaoDropdown(opcao.qaEngineer);
            await comunsPage.preencherCampoComTexto(campo.hiringManager, codigoUnico);
            await comunsPage.selecionarOpcaoDropdown(nomeCompleto);
            await comunsPage.clicarBotao(botao.save);
            // a mensagem temporaria nao e validada (instavel, conforme exercicio); o site so abre o Edit Vacancy apos salvar
            await comunsPage.garantirTelaPorTituloCarregada(opcao.editVacancy);
        });
    });
});
