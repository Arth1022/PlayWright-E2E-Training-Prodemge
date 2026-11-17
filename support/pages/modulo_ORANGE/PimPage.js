import HelpersPage from '../HelpersPage';
import pimLocators from '../../locators/modulo_ORANGE/PIM/pimLocators';

export default class PimPage {
  constructor(page) {
    this.page = page;
    this.helpersPage = new HelpersPage(page);
  }

  async inserirFotoDePerfil(imagem) {
    const botaoInserirFoto = this.page.locator(pimLocators.botaoInserirFotoDePerfil);
    await this.helpersPage.aguardarElemDisponivelEVisivel(botaoInserirFoto);
    await this.helpersPage.adicionarArquivoComClickBotao(botaoInserirFoto, imagem);
  }

  async validarFotoDePerfilECapturarDimensoes(descricaoFoto) {
    const fotoPerfil = this.page.locator(pimLocators.fotoDePerfil);
    const dimensoes = await this.helpersPage.validarImagemCarregadaECapturarDimensoes(fotoPerfil, descricaoFoto);
    return dimensoes;
  }
}
