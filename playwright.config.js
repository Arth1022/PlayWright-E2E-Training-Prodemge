// @ts-check
import { defineConfig, devices } from '@playwright/test';
import env from './config/env.js';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  // testDir: './e2e', // pasta dos testes - cada projeto define seu próprio testDir abaixo
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'always' }]
  ],
  timeout: 90000, // Tempo máximo de execução de cada teste (inclui todas as ações e validações)
  // expect: { timeout: 10000 }, // Tempo máximo que um expect pode aguardar até que a condição seja satisfeita (retry automático)
  globalSetup: './global/global-setup.js', // arquivo de configuração global (autenticação)
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // baseURL é definido dinamicamente por módulo no objeto projects abaixo
    headless: process.env.HEADLESS === 'true',
    ignoreHTTPSErrors: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // actionTimeout: 30000, // tempo máximo para ações (click, fill, etc)
    // navigationTimeout: 1000, // tempo máximo para navegações
  },

  /* Configure projects for major browsers */
  // Cada papel tem seu próprio storageState (gerado pelo global-setup).
  // O módulo acessado em cada teste é definido pelo método de login chamado (realizarLoginEmpolp, realizarLoginModuloX, etc).
  projects: (() => {
    const papeis = [
      { nome: 'operador',   modulo: 'orangeHRM',  storageState: 'storageState-orangeHRM-operador.json' },
    ];

    const browsers = process.env.CI
      ? [{ name: 'chromium', device: devices['Desktop Chrome'] }]
      : [
          { name: 'chromium', device: devices['Desktop Chrome'] },
          { name: 'firefox',  device: devices['Desktop Firefox'] },
          { name: 'webkit',   device: devices['Desktop Safari'] },
        ];

    return papeis.flatMap(papel =>
      browsers.map(browser => ({
        name: `${papel.nome}-${browser.name}`,
        testDir: './e2e',
        use: {
          ...browser.device,
          storageState: papel.storageState,
        },
      }))
    );
  })(),
});
