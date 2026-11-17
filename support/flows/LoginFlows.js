import LoginPage from "../pages/LoginPage";
import ComunsPage from "../pages/ComunsPage";
import env from '../../config/env.js';

export default class LoginFlows {
  constructor(page) {
    this.page = page;
    this.comunsPage = new ComunsPage(page);
    this.loginPage = new LoginPage(page);
  }

  async realizarLoginOrangeHRM(cpf, senha) {
    await this.loginPage.abrirUrl(env.baseURLOrange);
    await this.loginPage.preencherDadoUsuario(cpf);
    await this.loginPage.preencherSenha(senha);
    await this.loginPage.clicarBotaoLogin();
    await this.comunsPage.garantirTelaCarregada();
  }

  async entrarUrlAutenticadaOrange() {
    await this.loginPage.abrirUrl(env.urlAutenticadaOrange);
    await this.comunsPage.garantirTelaCarregada();
  }

}
