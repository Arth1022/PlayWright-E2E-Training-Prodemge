import HelpersPage from './HelpersPage';
import loginLocators from '../locators/loginLocators';

export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.helpersPage = new HelpersPage(page);
  }

  async abrirUrl(url){
    await this.page.goto(url); 
    await this.page.waitForLoadState('domcontentloaded');
  }

  async preencherDadoUsuario(usuario){
    const campoDadosUsuario = this.page.locator(loginLocators.usuarioInput);
    await this.helpersPage.aguardarElemDisponivelEVisivel(campoDadosUsuario);
    await this.helpersPage.preencherCampoColandoTexto(campoDadosUsuario, usuario);
  }

  async preencherSenha(senha){
    const campoSenhaUsuario = this.page.locator(loginLocators.senhaInput);
    await this.helpersPage.aguardarElemDisponivelEVisivel(campoSenhaUsuario);
    await this.helpersPage.preencherCampoColandoTexto(campoSenhaUsuario, senha);
  }

  
  async clicarBotaoLogin(){
    const botaoLogin = this.page.locator(loginLocators.loginButton);
    await this.helpersPage.aguardarElemDisponivelEVisivel(botaoLogin);
    await botaoLogin.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validarMensagemErroLogin(mensagemEsperada){
    const alertaErro = this.page.locator(loginLocators.mensagemErroLogin);
    await this.helpersPage.aguardarElemDisponivelEVisivel(alertaErro);
    await this.helpersPage.validarTextoLocalExato(alertaErro, mensagemEsperada);
  }
}
