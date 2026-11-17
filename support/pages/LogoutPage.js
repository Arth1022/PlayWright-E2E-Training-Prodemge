import HelpersPage from './HelpersPage';
import logoutLocators from '../locators/logoutLocators';
import loginLocators from '../locators/loginLocators';
import dados from '../../fixtures/dadosBasicos.json';

export default class LogoutPage {

    constructor(page) {
        this.page = page;
        this.helpersPage = new HelpersPage(page);
    }

    async abrirMenuUsuario() {
        const menuUsuario = this.page.locator(logoutLocators.sairMenu);
        await this.helpersPage.aguardarElemDisponivelEVisivel(menuUsuario);
        await menuUsuario.click();
    }

    async clicarLogout() {
        const { opcao } = dados;
        const botaoLogout = this.page.locator(logoutLocators.getDefinirLogout(opcao.logout));
        await this.helpersPage.aguardarElemDisponivelEVisivel(botaoLogout);
        await botaoLogout.click();
    }

    // Apenas aguarda a tela de login ficar disponível após o logout, sem validação de texto
    async garantirTelaLoginCarregada() {
        const titulo = this.page.locator(loginLocators.tituloLogin);
        await this.helpersPage.aguardarElemDisponivelEVisivel(titulo);
    }

    async validarTituloTelaLogin(textoEsperado) {
        const titulo = this.page.locator(loginLocators.tituloLogin);
        await this.helpersPage.aguardarElemDisponivelEVisivel(titulo);
        await this.helpersPage.validarTextoLocalExato(titulo, textoEsperado);
    }

}
