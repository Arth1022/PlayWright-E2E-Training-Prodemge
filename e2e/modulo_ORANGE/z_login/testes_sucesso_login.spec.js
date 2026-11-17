import { test } from '../../../fixtures/nao_autenticado.fixture.js';
import env from '../../../config/env.js';
import { obterUsuarioPorPapel } from '../../../config/usuarios.js';
import ComunsPage from '../../../support/pages/ComunsPage.js';
import LoginPage from '../../../support/pages/LoginPage.js';

test.describe('[login_sucesso] Testes Login', () => {

  test.describe('[login] Login com sucesso por papel', () => {

    test('[CT_#0001] Login com credenciais válidas (Operador)', async ({ nao_autenticado }) => {
      console.info(`
                ➡️ DESCRIÇÃO DO TESTE ⬅️ 
                LOGIN COM CREDENCIAIS VÁLIDAS PELO USUÁRIO Operador`);

      // abrir a url
      //preencher nome usuario
      //preencher senha
      //clicar botao login

      const operador = obterUsuarioPorPapel('operador');
      const comunsPage = new ComunsPage(nao_autenticado);
      const loginPage = new LoginPage(nao_autenticado);

      await loginPage.abrirUrl(env.baseURLOrange);
      await loginPage.preencherDadoUsuario(operador.cpf);
      await loginPage.preencherSenha(operador.senha);
      await loginPage.clicarBotaoLogin();
      await comunsPage.validarUrlAcessada(env.urlAutenticadaOrange);
    });
  });
});
