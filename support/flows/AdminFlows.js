import ComunsPage from '../pages/ComunsPage.js';
import dados from '../../fixtures/dadosBasicos.json';

export default class AdminFlows {
  constructor(page) {
    this.page = page;
    this.comunsPage = new ComunsPage(page);
  }

  // Pré-condição: cadastra o usuário vinculado ao funcionário criado pelo PimFlows.cadastrarFuncionario(),
  // usando o mesmo código único como Username
  async cadastrarUsuario(codigoUnico) {
    const { pessoa, opcao, botao, campo, informacao } = dados;
    await this.comunsPage.selecionarOpcaoMenu(opcao.admin);
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
    await this.comunsPage.clicarBotao(botao.add);
    await this.comunsPage.garantirTelaPorTituloCarregada(opcao.addUser);
    await this.comunsPage.abrirDropdown(campo.userRole);
    await this.comunsPage.selecionarOpcaoDropdown(opcao.ess);
    await this.comunsPage.preencherCampoComTexto(campo.employeeName, codigoUnico);
    await this.comunsPage.selecionarOpcaoDropdown(`${pessoa.joao} ${pessoa.pereira} ${pessoa.santos}`);
    await this.comunsPage.abrirDropdown(campo.status);
    await this.comunsPage.selecionarOpcaoDropdown(opcao.enabled);
    await this.comunsPage.preencherCampoComTexto(campo.username, codigoUnico);
    await this.comunsPage.preencherCampoComTexto(campo.password, informacao.senhaValida);
    await this.comunsPage.preencherCampoComTexto(campo.confirmPassword, informacao.senhaValida);
    await this.comunsPage.clicarBotao(botao.save);
    // o site só volta para a listagem System Users depois que o cadastro foi salvo
    await this.comunsPage.garantirTelaInicialPorNomeCarregada(opcao.systemUsers);
  }
}
