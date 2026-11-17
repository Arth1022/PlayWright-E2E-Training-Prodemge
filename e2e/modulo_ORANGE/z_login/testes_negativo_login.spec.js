import { test } from '../../../fixtures/nao_autenticado.fixture.js';
import env from '../../../config/env.js';
import { obterUsuarioPorPapel } from '../../../config/usuarios.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import LoginPage from '../../../support/pages/LoginPage.js';
import dados from '../../../fixtures/dadosBasicos.json';

test.describe('[login_negativo] Testes Login', () => {

  test.describe('[login] Login com credenciais invalidas', () => {

    test('[CT_#0002] Login com usuario invalido exibe mensagem de erro', async ({ nao_autenticado }) => {
      console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️
                TENTA REALIZAR LOGIN COM UM USUÁRIO INVÁLIDO E VALIDA A MENSAGEM DE ERRO`);

      // abrir a url
      // preencher usuario inexistente
      // preencher a senha correta do usuario operador
      // clicar botao login
      // validar mensagem de erro e permanencia na tela de login

      const { login, mensagem } = dados;
      const operador = obterUsuarioPorPapel('operador');
      const comunsPage = new ComunsPage(nao_autenticado);
      const loginPage = new LoginPage(nao_autenticado);

      await loginPage.abrirUrl(env.baseURLOrange);
      await loginPage.preencherDadoUsuario(login.cpfInvalido);
      await loginPage.preencherSenha(operador.senha);
      await loginPage.clicarBotaoLogin();
      await loginPage.validarMensagemErroLogin(mensagem.credenciaisInvalidas);
      await comunsPage.validarUrlAcessada(env.baseURLOrange);
    });
  });
});
