import HelpersPage from '../pages/HelpersPage.js';
import ComunsPage from '../pages/ComunsPage.js';
import dados from '../../fixtures/dadosBasicos.json';

export default class RecruitmentFlows {
  constructor(page) {
    this.page = page;
    this.helpersPage = new HelpersPage(page);
    this.comunsPage = new ComunsPage(page);
  }

  // Pré-condição: cadastra uma vaga com os campos obrigatórios, tendo como Hiring Manager o funcionário
  // criado pelo PimFlows.cadastrarFuncionario(), e retorna o nome da vaga
  async cadastrarVaga(codigoUnico) {
    const { pessoa, opcao, botao, campo, mensagem } = dados;
    const nomeVaga = `${codigoUnico} ${mensagem.testeAutomatizadoPlaywright}`;
    await this.comunsPage.selecionarOpcaoMenu(opcao.recruitment);
    await this.comunsPage.selecionarAbaMenuSuperior(opcao.vacancies);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.vacancies);
    await this.comunsPage.clicarBotao(botao.add);
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.addVacancy);
    await this.comunsPage.preencherCampoComTexto(campo.vacancyName, nomeVaga);
    await this.comunsPage.abrirDropdown(campo.jobTitle);
    await this.comunsPage.selecionarOpcaoDropdown(opcao.qaEngineer);
    await this.comunsPage.preencherCampoComTexto(campo.hiringManager, codigoUnico);
    await this.comunsPage.selecionarOpcaoDropdown(`${pessoa.joao} ${pessoa.pereira} ${pessoa.santos}`);
    await this.comunsPage.clicarBotao(botao.save);
    // o site só abre a tela Edit Vacancy depois que a vaga foi salva
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.editVacancy);
    return nomeVaga;
  }

  async pesquisarVagaPorNome(nomeVaga) {
    const { opcao, botao, campo } = dados;
    await this.comunsPage.selecionarOpcaoMenu(opcao.recruitment);
    await this.comunsPage.selecionarAbaMenuSuperior(opcao.vacancies);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.vacancies);
    await this.comunsPage.abrirDropdown(campo.vacancy);
    await this.comunsPage.selecionarOpcaoDropdown(nomeVaga);
    await this.comunsPage.clicarBotao(botao.search);
    await this.comunsPage.garantirTelaCarregada();
  }

  async removerVaga(nomeVaga) {
    const { botao } = dados;
    await this.pesquisarVagaPorNome(nomeVaga);
    await this.comunsPage.clicarExcluirNaLinha(nomeVaga);
    await this.comunsPage.clicarBotaoModal(botao.yesDelete);
    await this.comunsPage.garantirTelaCarregada();
  }

  // Pré-condição: cadastra um candidato com a massa padrão e retorna o código único usado no sobrenome e nas Keywords
  async cadastrarCandidato() {
    const { pessoa, opcao, botao, campo, informacao } = dados;
    const codigoUnico = this.helpersPage.gerarCodigoAleatorio_abc12345();
    await this.comunsPage.selecionarOpcaoMenu(opcao.recruitment);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
    await this.comunsPage.clicarBotao(botao.add);
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.addCandidate);
    await this.comunsPage.preencherNome(campo.firstName, pessoa.joao);
    await this.comunsPage.preencherNome(campo.middleName, pessoa.pereira);
    await this.comunsPage.preencherNome(campo.lastName, codigoUnico);
    await this.comunsPage.preencherCampoComTexto(campo.email, informacao.emailCandidato);
    await this.comunsPage.preencherCampoComTexto(campo.keywords, codigoUnico);
    await this.comunsPage.clicarBotao(botao.save);
    // o site só abre o perfil depois que o candidato foi salvo
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.candidateProfile);
    return codigoUnico;
  }

  async pesquisarCandidatoPorVaga(nomeVaga) {
    const { opcao, botao, campo } = dados;
    await this.comunsPage.selecionarOpcaoMenu(opcao.recruitment);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
    await this.comunsPage.abrirDropdown(campo.vacancy);
    await this.comunsPage.selecionarOpcaoDropdown(nomeVaga);
    await this.comunsPage.clicarBotao(botao.search);
    await this.comunsPage.garantirTelaCarregada();
  }

  // A vaga é única do teste, então a linha do candidato é localizada pelo nome da vaga
  async removerCandidatoDaVaga(nomeVaga) {
    const { botao } = dados;
    await this.pesquisarCandidatoPorVaga(nomeVaga);
    await this.comunsPage.clicarExcluirNaLinha(nomeVaga);
    await this.comunsPage.clicarBotaoModal(botao.yesDelete);
    await this.comunsPage.garantirTelaCarregada();
  }
}
