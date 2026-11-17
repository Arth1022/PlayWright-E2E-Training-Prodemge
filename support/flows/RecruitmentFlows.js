import ComunsPage from '../pages/ComunsPage.js';
import dados from '../../fixtures/dadosBasicos.json';

export default class RecruitmentFlows {
  constructor(page) {
    this.page = page;
    this.comunsPage = new ComunsPage(page);
  }

  // Pre-condicao: cadastra uma vaga com os campos obrigatorios, tendo como Hiring Manager o funcionario
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
    // o site so abre a tela Edit Vacancy depois que a vaga foi salva
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

  async pesquisarCandidatoPorVaga(nomeVaga) {
    const { opcao, botao, campo } = dados;
    await this.comunsPage.selecionarOpcaoMenu(opcao.recruitment);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.candidates);
    await this.comunsPage.abrirDropdown(campo.vacancy);
    await this.comunsPage.selecionarOpcaoDropdown(nomeVaga);
    await this.comunsPage.clicarBotao(botao.search);
    await this.comunsPage.garantirTelaCarregada();
  }

  // A vaga e unica do teste, entao a linha do candidato e localizada pelo nome da vaga
  async removerCandidatoDaVaga(nomeVaga) {
    const { botao } = dados;
    await this.pesquisarCandidatoPorVaga(nomeVaga);
    await this.comunsPage.clicarExcluirNaLinha(nomeVaga);
    await this.comunsPage.clicarBotaoModal(botao.yesDelete);
    await this.comunsPage.garantirTelaCarregada();
  }
}
