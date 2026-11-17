import { test as base } from '@playwright/test';

/**
 * FIXTURE: Com Autenticação + Papel
 *
 * Fornece dois recursos para testes autenticados:
 * 1. page             - página já autenticada (via storageState do global-setup)
 * 2. papelAutenticado - papel em execução (ex: 'operador', 'financeiro')
 *
 * O papel é derivado automaticamente do nome do projeto Playwright:
 *   operador-chromium   → 'operador'
 *   financeiro-chromium → 'financeiro'
 *
 * O módulo acessado é definido pelo método de login chamado no teste:
 *   loginFlows.realizarLoginEmpolp(cpf, senha)
 *   loginFlows.realizarLoginProgfin(cpf, senha)
 *
 * Uso nos testes:
 *   test.skip(papelAutenticado !== 'operador');
 */
export const test = base.extend({
  papelAutenticado: async ({ }, use, testInfo) => {
    // Extrai o papel do nome do projeto: 'operador-chromium' → 'operador'
    const papel = testInfo.project.name.split('-')[0];
    await use(papel);
  }
});

export { expect } from '@playwright/test';
