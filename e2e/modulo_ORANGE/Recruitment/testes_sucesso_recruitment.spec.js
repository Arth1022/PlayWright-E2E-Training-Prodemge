import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import HelpersPage from '../../../support/pages/HelpersPage.js';
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

    test.describe('[recruitment_candidato_cadastro] Cadastro de candidato pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            const recruitmentFlows = new RecruitmentFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // pre-condicao: funcionario criado no PIM (Hiring Manager) e vaga criada no Recruitment para o candidato
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
            const nomeVaga = await recruitmentFlows.cadastrarVaga(codigoUnico);
            testInfo['nomeVaga'] = nomeVaga;
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remove na ordem inversa da criacao: candidato, vaga e funcionario
            const codigoUnico = testInfo['codigoUnico'];
            const nomeVaga = testInfo['nomeVaga'];
            const recruitmentFlows = new RecruitmentFlows(page);
            const pimFlows = new PimFlows(page);
            await recruitmentFlows.removerCandidatoDaVaga(nomeVaga);
            await recruitmentFlows.removerVaga(nomeVaga);
            await pimFlows.removerFuncionario(codigoUnico);
        });

        test('[CT_#0013] Cadastrar candidato com dados completos', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                CADASTRA UM CANDIDATO COM TODOS OS CAMPOS, VINCULADO À VAGA CRIADA PELO TESTE E COM UPLOAD DO CURRÍCULO,
                PESQUISA O CANDIDATO, ABRE A VISUALIZAÇÃO E VALIDA TODOS OS DADOS, INCLUSIVE O ARQUIVO`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, campo, mensagem, arquivo, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            const helpersPage = new HelpersPage(page);
            const codigoUnico = testInfo['codigoUnico'];
            const nomeVaga = testInfo['nomeVaga'];
            const nomeCompleto = `${pessoa.joao} ${pessoa.pereira} ${pessoa.santos}`;
            const email = `${codigoUnico}${informacao.dominioEmailTeste}`;

            await comunsPage.selecionarOpcaoMenu(opcao.recruitment);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addCandidate);

            await comunsPage.preencherNome(campo.firstName, pessoa.joao);
            await comunsPage.preencherNome(campo.middleName, pessoa.pereira);
            await comunsPage.preencherNome(campo.lastName, pessoa.santos);
            await comunsPage.abrirDropdown(campo.vacancy);
            await comunsPage.selecionarOpcaoDropdown(nomeVaga);
            await comunsPage.preencherCampoComTexto(campo.email, email);
            await comunsPage.preencherCampoComTexto(campo.contactNumber, informacao.telefoneValido);
            await comunsPage.inserirArquivo(campo.resume, arquivo.arquivoPDFTestePath);
            await comunsPage.preencherCampoComTexto(campo.keywords, codigoUnico);
            await comunsPage.preencherCampoComTexto(campo.dateOfApplication, informacao.dataAplicacao);
            await comunsPage.preencherAreaTexto(campo.notes, mensagem.testeAutomatizadoPlaywright);
            await comunsPage.marcarCheckbox(campo.consentToKeepData);
            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemTemporaria(mensagem.succesfullySaved);
            await comunsPage.garantirTelaCarregada();

            // a vaga e unica do teste, entao a linha do candidato e localizada pelo nome da vaga
            await comunsPage.selecionarOpcaoMenu(opcao.recruitment);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
            await comunsPage.abrirDropdown(campo.vacancy);
            await comunsPage.selecionarOpcaoDropdown(nomeVaga);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(nomeVaga);
            await comunsPage.validarInformacaoNaLista(nomeCompleto);
            await comunsPage.clicarVisualizarNaLinha(nomeVaga);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.candidateProfile);

            await comunsPage.validarValorNome(campo.firstName, pessoa.joao);
            await comunsPage.validarValorNome(campo.middleName, pessoa.pereira);
            await comunsPage.validarValorNome(campo.lastName, pessoa.santos);
            await comunsPage.validarOpcaoDropdown(campo.jobVacancy, nomeVaga);
            await comunsPage.validarValorCampo(campo.email, email);
            await comunsPage.validarValorCampo(campo.contactNumber, informacao.telefoneValido);
            await comunsPage.validarNomeArquivo(campo.resume, arquivo.arquivoPDFTesteNome);
            const downloadCurriculo = await comunsPage.baixarArquivo(campo.resume);
            await helpersPage.validarDownloadArquivo(downloadCurriculo, arquivo.extensaoPdf, informacao.curriculoCandidato);
            await comunsPage.validarValorCampo(campo.keywords, codigoUnico);
            await comunsPage.validarValorCampo(campo.dateOfApplication, informacao.dataAplicacao);
            await comunsPage.validarValorAreaTexto(campo.notes, mensagem.testeAutomatizadoPlaywright);
        });
    });
});
