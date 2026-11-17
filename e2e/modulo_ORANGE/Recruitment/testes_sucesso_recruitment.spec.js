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
            // cria no PIM o funcionário que será o Hiring Manager da vaga
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            testInfo['codigoUnico'] = codigoUnico;
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remove a vaga criada no teste e depois o funcionário usado como Hiring Manager
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
            // a mensagem temporária não é validada (instável, conforme exercício); o site só abre o Edit Vacancy após salvar
            await comunsPage.garantirTelaPorTituloCarregada(opcao.editVacancy);
        });
    });

    test.describe('[recruitment_candidato_cadastro] Cadastro de candidato pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // Por o beforeEach deste teste ser pesado, ele pode passar do timeout padrão e falhar, usei o test.slow() para impedir essa falha por timeout
            test.slow();
            const loginFlows = new LoginFlows(page);
            const pimFlows = new PimFlows(page);
            const recruitmentFlows = new RecruitmentFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            // pré-condição: funcionário criado no PIM (Hiring Manager) e vaga criada no Recruitment para o candidato
            const codigoUnico = await pimFlows.cadastrarFuncionario();
            const nomeVaga = await recruitmentFlows.cadastrarVaga(codigoUnico);
            // salva os dois dados relacionados juntos, para o corpo do teste e o afterEach
            testInfo['dadosVaga'] = { codigoUnico, nomeVaga };
        });

        test.afterEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            // remove na ordem inversa da criação: candidato, vaga e funcionário
            const { codigoUnico, nomeVaga } = testInfo['dadosVaga'];
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
            const { codigoUnico, nomeVaga } = testInfo['dadosVaga'];
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
            await comunsPage.validarMensagemTemporaria(mensagem.successfullySaved);
            await comunsPage.garantirTelaCarregada();

            // a vaga é única do teste, então a linha do candidato é localizada pelo nome da vaga
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

    test.describe('[recruitment_candidato_exclusao] Exclusao de candidato pelo usuario (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }, testInfo) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            const recruitmentFlows = new RecruitmentFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
            const codigoUnico = await recruitmentFlows.cadastrarCandidato();
            // salva o código para transportar para o corpo do teste
            testInfo['codigoUnico'] = codigoUnico;
        });

        test('[CT_#0014] Excluir candidato', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                EXCLUI UM CANDIDATO CRIADO PELO TESTE, VALIDA A CONFIRMAÇÃO DE EXCLUSÃO, A MENSAGEM DE SUCESSO
                E A AUSÊNCIA DO CANDIDATO NA LISTAGEM APÓS O FILTRO`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, campo, mensagem, informacao } = dados;
            const comunsPage = new ComunsPage(page);
            // recebe o código do candidato cadastrado no beforeEach (usado no sobrenome e nas Keywords)
            const codigoUnico = testInfo['codigoUnico'];
            const nomeCandidato = `${pessoa.joao} ${pessoa.pereira} ${codigoUnico}`;

            await comunsPage.selecionarOpcaoMenu(opcao.recruitment);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
            await comunsPage.preencherCampoComTexto(campo.keywords, codigoUnico);
            await comunsPage.clicarBotao(botao.search);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaLista(nomeCandidato);

            await comunsPage.clicarExcluirNaLinha(nomeCandidato);
            await comunsPage.validarModal(informacao.areYouSure);
            await comunsPage.clicarBotaoModal(botao.yesDelete);
            await comunsPage.validarMensagemTemporaria(mensagem.successfullyDeleted);
            await comunsPage.garantirTelaCarregada();
            await comunsPage.validarInformacaoNaoEstaNaLista(nomeCandidato);
        });
    });
});
