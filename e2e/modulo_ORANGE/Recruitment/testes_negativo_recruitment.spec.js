import { test } from '../../../fixtures/usuario_autenticado.fixture.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import dados from '../../../fixtures/dadosBasicos.json';
import LoginFlows from '../../../support/flows/LoginFlows.js';

test.describe('[recruitment_negativo] Testes tela Recruitment', () => {

    test.describe('[recruitment_candidato_contato_invalido] Cadastro de candidato com Contact Number invalido (operador)', () => {

        test.beforeEach(async ({ page, papelAutenticado }) => {
            test.skip(papelAutenticado !== 'operador');
            const loginFlows = new LoginFlows(page);
            await loginFlows.entrarUrlAutenticadaOrange();
        });

        test('[CT_#0015] Cadastrar candidato com Contact Number inválido', async ({ page, papelAutenticado }, testInfo) => {
            console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                TENTA CADASTRAR UM CANDIDATO COM OS CAMPOS OBRIGATÓRIOS VÁLIDOS E CARACTERES INVÁLIDOS NO
                CONTACT NUMBER E VALIDA A MENSAGEM DE ERRO NO CAMPO`);
            test.skip(papelAutenticado !== 'operador');
            const { pessoa, opcao, botao, campo, mensagem, informacao } = dados;
            const comunsPage = new ComunsPage(page);

            await comunsPage.selecionarOpcaoMenu(opcao.recruitment);
            await comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
            await comunsPage.clicarBotao(botao.add);
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addCandidate);

            await comunsPage.preencherNome(campo.firstName, pessoa.joao);
            await comunsPage.preencherNome(campo.middleName, pessoa.pereira);
            await comunsPage.preencherNome(campo.lastName, pessoa.santos);
            await comunsPage.preencherCampoComTexto(campo.email, informacao.emailCandidato);
            await comunsPage.preencherCampoComTexto(campo.contactNumber, informacao.telefoneInvalido);

            await comunsPage.clicarBotao(botao.save);
            await comunsPage.validarMensagemErroNoCampo(campo.contactNumber, mensagem.telefoneCaracteresInvalidos);
            // o cadastro não pode ser concluído, permanece na tela de Add Candidate
            await comunsPage.garantirTelaPorTituloCarregada(opcao.addCandidate);
        });
    });
});
