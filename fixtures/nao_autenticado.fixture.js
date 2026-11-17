import { test as base } from '@playwright/test';

export const test = base.extend({

  nao_autenticado: async ({ browser }, use) => {

    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await use(page);

    await context.close();
  }

});

export { expect } from '@playwright/test';