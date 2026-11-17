import HelpersPage from './HelpersPage';
import comunsLocators from '../locators/comunsLocators';

export default class ComunsPage {
  constructor(page) {
    this.page = page;
    this.helpersPage = new HelpersPage(page);
  }

  async garantirTelaCarregada(timeout = 30000) {  //timeout = Orange demora carregar
    const telaCarregada = this.page.locator(comunsLocators.carregamentoTela);
    await this.helpersPage.aguardarTelaEstabilizar(telaCarregada, timeout);
  }

  // Validação de URL comum a login, logout e demais telas
  async validarUrlAcessada(urlEsperada) {
    await this.helpersPage.validarUrl(urlEsperada);
  }

  async selecionarOpcaoMenu(opcao) {
    const item = this.page.locator(comunsLocators.getOpcaoMenu(opcao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(item);
    await item.click();
    await this.garantirTelaCarregada();
  }

  async garantirTelaInicialPorNomeCarregada(nomeTela) {
    await this.garantirTelaCarregada();
    const titulo = this.page.locator(comunsLocators.getTituloListagem(nomeTela));
    await this.helpersPage.aguardarElemDisponivelEVisivel(titulo);
  }

  async garantirTelaPorTituloCarregada(nomeTela) {
    await this.garantirTelaCarregada();
    const titulo = this.page.locator(comunsLocators.getTituloTela(nomeTela));
    await this.helpersPage.aguardarElemDisponivelEVisivel(titulo);
  }

  async clicarBotao(nomeBotao) {
    const botao = this.page.locator(comunsLocators.getBotao(nomeBotao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(botao);
    await botao.click();
  }

  async preencherNome(placeholderCampo, texto) {
    const campo = this.page.locator(comunsLocators.getCampoPorPlaceholder(placeholderCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(campo);
    await this.helpersPage.preencherCampoEscrevendoTexto(campo, texto);
  }

  async validarMensagemErroNoNome(placeholderCampo, mensagem) {
    const mensagemErro = this.page.locator(comunsLocators.getMensagemErroPorPlaceholder(placeholderCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(mensagemErro);
    await this.helpersPage.validarTextoLocalExato(mensagemErro, mensagem);
  }

  async preencherCampoComTexto(nomeCampo, texto) {
    const campo = this.page.locator(comunsLocators.getCampoPorLabel(nomeCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(campo);
    await this.helpersPage.preencherCampoEscrevendoTexto(campo, texto);
  }

  async validarMensagemErroNoCampo(nomeCampo, mensagem) {
    const mensagemErro = this.page.locator(comunsLocators.getMensagemErroPorLabel(nomeCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(mensagemErro);
    await this.helpersPage.validarTextoLocalExato(mensagemErro, mensagem);
  }

  async marcarCheckbox(nomeCampo) {
    const checkbox = this.page.locator(comunsLocators.getCheckboxPorLabel(nomeCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(checkbox);
    await checkbox.click();
  }

  async abrirDropdown(nomeCampo) {
    const dropdown = this.page.locator(comunsLocators.getDropdownPorLabel(nomeCampo));
    await this.helpersPage.aguardarElemDisponivelEVisivel(dropdown);
    await dropdown.click();
  }

  // Seleciona a opcao na lista exibida, tanto do dropdown aberto quanto das sugestoes de um campo autocomplete
  async selecionarOpcaoDropdown(opcao) {
    const item = this.page.locator(comunsLocators.getOpcaoLista(opcao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(item);
    await item.click();
    await this.helpersPage.aguardarElementoSumir(item);
  }

  async validarValorCampo(nomeCampo, valorEsperado) {
    const campo = this.page.locator(comunsLocators.getCampoPorLabel(nomeCampo));
    await this.helpersPage.validarTextoLocalExatoNoInput(campo, valorEsperado);
  }

  async validarMensagemTemporaria(mensagem) {
    const elemento = this.page.locator(comunsLocators.getMensagemTemporaria(mensagem));
    await this.helpersPage.aguardarElemDisponivelEVisivel(elemento);
    await this.helpersPage.validarTextoLocalExato(elemento, mensagem);
    await this.helpersPage.aguardarElementoSumir(elemento);
  }

  async validarInformacaoNaLista(informacao) {
    await this.garantirTelaCarregada();
    const linha = this.page.locator(comunsLocators.getInformacaoNaLista(informacao)).first();
    await this.helpersPage.aguardarElemDisponivelEVisivel(linha);
    await this.helpersPage.validarTextoLocalExato(linha, informacao);
  }

  async validarInformacaoNaoEstaNaLista(informacao) {
    await this.garantirTelaCarregada();
    const linha = this.page.locator(comunsLocators.getInformacaoNaLista(informacao));
    await this.helpersPage.aguardarElementoSumir(linha);
  }

  async clicarExcluirNaLinha(informacao) {
    await this.garantirTelaCarregada();
    const botaoExcluir = this.page.locator(comunsLocators.getExcluirNaLinha(informacao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(botaoExcluir);
    await botaoExcluir.click();
  }

  async clicarEditarNaLinha(informacao) {
    await this.garantirTelaCarregada();
    const botaoEditar = this.page.locator(comunsLocators.getEditarNaLinha(informacao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(botaoEditar);
    await botaoEditar.click();
  }

  async validarModal(tituloModal) {
    const titulo = this.page.locator(comunsLocators.tituloModal);
    await this.helpersPage.aguardarElemDisponivelEVisivel(titulo);
    await this.helpersPage.validarTextoLocalExato(titulo, tituloModal);
  }

  async clicarBotaoModal(nomeBotao) {
    const botao = this.page.locator(comunsLocators.getBotaoModal(nomeBotao));
    await this.helpersPage.aguardarElemDisponivelEVisivel(botao);
    await botao.click();
    await this.helpersPage.aguardarElementoSumir(botao);
  }

}
