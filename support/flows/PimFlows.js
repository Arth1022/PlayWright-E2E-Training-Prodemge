import HelpersPage from '../pages/HelpersPage.js';
import ComunsPage from '../pages/ComunsPage.js';
import dados from '../../fixtures/dadosBasicos.json';

export default class PimFlows {
  constructor(page) {
    this.page = page;
    this.helpersPage = new HelpersPage(page);
    this.comunsPage = new ComunsPage(page);
  }

  // Pré-condição: cadastra um funcionário com a massa padrão e retorna o código único usado como Employee Id
  async cadastrarFuncionario() {
    const { pessoa, opcao, botao, campo } = dados;
    const codigoUnico = this.helpersPage.gerarCodigoAleatorio_abc12345();
    await this.comunsPage.selecionarOpcaoMenu(opcao.pim);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
    await this.comunsPage.clicarBotao(botao.add);
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.addEmployee);
    await this.comunsPage.preencherNome(campo.firstName, pessoa.joao);
    await this.comunsPage.preencherNome(campo.middleName, pessoa.pereira);
    await this.comunsPage.preencherNome(campo.lastName, pessoa.santos);
    await this.comunsPage.preencherCampoComTexto(campo.employeeId, codigoUnico);
    await this.comunsPage.clicarBotao(botao.save);
    // o site só abre a tela Personal Details depois que o cadastro foi salvo
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.personalDetails);
    return codigoUnico;
  }

  async pesquisarFuncionarioPorId(idFuncionario) {
    const { opcao, botao, campo } = dados;
    await this.comunsPage.selecionarOpcaoMenu(opcao.pim);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.employeeInformation);
    await this.comunsPage.preencherCampoComTexto(campo.employeeId, idFuncionario);
    await this.comunsPage.clicarBotao(botao.search);
    await this.comunsPage.garantirTelaCarregada();
  }

  async removerFuncionario(idFuncionario) {
    const { botao } = dados;
    await this.pesquisarFuncionarioPorId(idFuncionario);
    await this.comunsPage.clicarExcluirNaLinha(idFuncionario);
    await this.comunsPage.clicarBotaoModal(botao.yesDelete);
    await this.comunsPage.garantirTelaCarregada();
  }
}