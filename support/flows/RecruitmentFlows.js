import ComunsPage from '../pages/ComunsPage.js';
import dados from '../../fixtures/dadosBasicos.json';

export default class RecruitmentFlows {
  constructor(page) {
    this.page = page;
    this.comunsPage = new ComunsPage(page);
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
}
