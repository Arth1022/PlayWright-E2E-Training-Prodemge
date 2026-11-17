import { expect } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

export default class HelpersPage {
  // Classes diversas são instanciadas uma única vez no constructor e recebem (page)
  constructor(page) {
    this.page = page;
  }

  // Dentro dos métodos não se instanciam as classes, só cria-se constante de acordo com a necessidade
  // Para chamar uma Classe dentro de um método, usa-se o this antes do nome -> this.nomeClasse.nomeMetodo();
  async aguardarElemDisponivelEVisivel(locator) {
    try {
      // Aguarda até que o elemento exista no DOM por até 30 segundos
      await locator.waitFor({ state: 'attached', timeout: 30000 });
      // Assert para validar se o elemento está visível na tela
      await expect(locator).toBeVisible({ timeout: 5000 }); // Espere ATÉ 5 segundos para que o elemento fique visível.
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Falha ao validar visibilidade do elemento: ${locator}`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Falha ao validar visibilidade do elemento: ${locator}`, { cause: erro });// throw new Error + { cause: erro } -> Erro aparecerá no report (DOM snapshot, stack, trace)
    }
  }

  async aguardarElementoSumir(locator) {
    // await expect(locator).toBeAttached(); // garante que elemento existiu
    await locator.waitFor({ state: 'hidden' }); // espera ele sumir
  }

  async preencherCampoColandoTexto(locator, texto) {
    let tentativas = 0;

    while (tentativas < 5) {
      try {
        // Espera o campo estar visível e habilitado
        await expect(locator).toBeVisible({ timeout: 5000 });
        await expect(locator).toBeEnabled({ timeout: 5000 });

        await locator.click();
        await this.page.locator('body').hover(); // Move o mouse para fora do campo evitando travamentos comuns no ZK
        await locator.fill(''); // Limpa completamente o conteúdo atual do campo
        const textoResolvido = await Promise.resolve(texto);
        await locator.fill(String(textoResolvido ?? '')); // Cola o valor da variavel como um Ctrl+V
        await locator.blur(); // remove o foco do elemento atual, clicado fora do campo
        return; // sucesso
      } catch (elemento) { // Se o elemento foi recriado/sumiu do DOM OU elemento ainda não apareceu no DOM
        if (elemento.message.includes('detached from the DOM') || elemento.message.includes('waiting for selector')) {
          tentativas++;
          await this.page.waitForTimeout(300); // pequeno intervalo milissegundos antes de tentar de novo
        } else { // Qualquer outro erro não esperado é lançado imediatamente
          throw elemento;
        }
      }
    }
    // Se todas as tentativas falharem, lança erro explícito
    // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
    console.error(`Não foi possível preencher o campo: ${locator.selector}`);
    // mensagem que aparece na aba "Errors" da UI do PlayWright
    throw new Error(`Não foi possível preencher o campo: ${locator.selector}`);
  }

  async preencherCampoEscrevendoTexto(locator, texto, delay = 50) {
    let tentativas = 0;

    while (tentativas < 5) {
      try {
        // Espera o campo estar visível e habilitado
        await expect(locator).toBeVisible({ timeout: 5000 });
        await expect(locator).toBeEnabled({ timeout: 5000 });

        await locator.click();
        await this.page.locator('body').hover(); // Move o mouse para fora do campo evitando travamentos comuns no ZK
        // limpa campo no modo “simulação humana”, antes de digitar
        await locator.press('Control+A');
        await locator.press('Backspace');
        const textoResolvido = await Promise.resolve(texto);
        await locator.pressSequentially(String(textoResolvido ?? ''), { delay }); // digitação humana, com delay padrão e customizável
        // await locator.blur(); // remove o foco do elemento atual, clicado fora do campo
        return; // sucesso
      } catch (elemento) { // Se o elemento foi recriado/sumiu do DOM OU elemento ainda não apareceu no DOM
        if (elemento.message.includes('detached from the DOM') || elemento.message.includes('waiting for selector')) {
          tentativas++;
          await this.page.waitForTimeout(300); // pequeno intervalo milissegundos antes de tentar de novo
        } else { // Qualquer outro erro não esperado é lançado imediatamente
          throw elemento;
        }
      }
    }
    // Se todas as tentativas falharem, lança erro explícito
    // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
    console.error(`Não foi possível preencher o campo: ${locator.selector}`);
    // mensagem que aparece na aba "Errors" da UI do PlayWright
    throw new Error(`Não foi possível preencher o campo: ${locator.selector}`);
  }

  async preencherCampoColandoNumero(locator, valor) {
    let tentativas = 0;

    while (tentativas < 5) {
      try {
        // Espera o campo estar visível e habilitado
        await expect(locator).toBeVisible({ timeout: 5000 });
        await expect(locator).toBeEnabled({ timeout: 5000 });

        await locator.click();
        await this.page.locator('body').hover(); // Move o mouse para fora do campo evitando travamentos comuns no ZK
        await locator.fill(''); // Limpa completamente o conteúdo atual do campo
        const valorResolvido = await Promise.resolve(valor);
        await locator.fill(String(valorResolvido ?? '')); // Cola o valor da variavel como um Ctrl+V
        await locator.blur(); // remove o foco do elemento atual, clicado fora do campo
        return; // sucesso
      } catch (elemento) { // Se o elemento foi recriado/sumiu do DOM OU elemento ainda não apareceu no DOM
        if (elemento.message.includes('detached from the DOM') || elemento.message.includes('waiting for selector')) {
          tentativas++;
          await this.page.waitForTimeout(300); // pequeno intervalo milissegundos antes de tentar de novo
        } else { // Qualquer outro erro não esperado é lançado imediatamente
          throw elemento;
        }
      }
    }
    // Se todas as tentativas falharem, lança erro explícito
    // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
    console.error(`Não foi possível preencher o campo: ${locator.selector}`);
    // mensagem que aparece na aba "Errors" da UI do PlayWright
    throw new Error(`Não foi possível preencher o campo: ${locator.selector}`);
  }


  async preencherCampoEscrevendoNumero(locator, valor, delay = 50) {
    let tentativas = 0;

    while (tentativas < 5) {
      try {
        // Espera o campo estar visível e habilitado
        await expect(locator).toBeVisible({ timeout: 5000 });
        await expect(locator).toBeEnabled({ timeout: 5000 });

        await locator.click();
        await this.page.locator('body').hover(); // Move o mouse para fora do campo evitando travamentos comuns no ZK
        // limpa campo no modo “simulação humana”, antes de digitar
        await locator.press('Control+A');
        await locator.press('Backspace');
        const valorResolvido = await Promise.resolve(valor);
        await locator.pressSequentially(String(valorResolvido ?? ''), { delay }); // digitação humana, com delay padrão e customizável
        // await locator.blur(); // remove o foco do elemento atual, clicado fora do campo
        return; // sucesso
      } catch (elemento) { // Se o elemento foi recriado/sumiu do DOM OU elemento ainda não apareceu no DOM
        if (elemento.message.includes('detached from the DOM') || elemento.message.includes('waiting for selector')) {
          tentativas++;
          await this.page.waitForTimeout(300); // pequeno intervalo milissegundos antes de tentar de novo
        } else { // Qualquer outro erro não esperado é lançado imediatamente
          throw elemento;
        }
      }
    }
    // Se todas as tentativas falharem, lança erro explícito
    // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
    console.error(`Não foi possível preencher o campo: ${locator.selector}`);
    // mensagem que aparece na aba "Errors" da UI do PlayWright
    throw new Error(`Não foi possível preencher o campo: ${locator.selector}`);
  }

  async validarUrl(urlEsperada) {
    try {
      expect(urlEsperada, 'A URL esperada deve ser uma string.').toEqual(expect.any(String));
      expect(urlEsperada.trim(), 'A URL esperada não pode estar vazia.').not.toBe('');
      await expect(this.page).toHaveURL(urlEsperada);
      const urlEncontrada = this.page.url();

      console.info(`
        URL validada com sucesso: 
        Encontrada = ${urlEncontrada}
            Esperada = ${urlEsperada}`);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`URL não validada!`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw erro;
    }
  }

  async validarTextoContidoNaPagina(textoEsperado) {
    // Texto exato em qualquer lugar na página usar = getByText(variavelEsperada, { exact: true })
    const elemento = this.page.getByText(textoEsperado, { exact: true });

    try {
      await expect(elemento).toBeVisible();

      const textoEncontrado = (await elemento.first().innerText()).trim();

      console.info(`
        Texto validado com sucesso: 
        Encontrado = "${textoEncontrado}"
            Esperado = "${textoEsperado}"
      `);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Texto não validado: ${textoEsperado}`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Texto não validado: ${textoEsperado}`, { cause: erro });
    }
  }

  async validarTextoLocalExato(locator, textoEsperado) {
    try {
      // espera o elemento ficar visível
      await expect(locator).toBeVisible({ timeout: 5000 });
      // Texto exato em elemento específico usar = locator + toHaveText (variavelEsperada)
      await expect(locator).toHaveText(textoEsperado, { timeout: 5000 });

      const textoEncontrado = (await locator.innerText()).trim();
      console.info(`
        Texto validado com sucesso: 
        Encontrado = "${textoEncontrado}"  
            Esperado = "${textoEsperado}"`);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Texto não validado!`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Texto não validado!`, { cause: erro });
    }
  }

  async validarTextoLocalExatoNoInput(locator, valorEsperado) {
    try {
      // espera o elemento ficar visível
      await expect(locator).toBeVisible({ timeout: 5000 });
      // valida o VALUE do input (não o texto)
      await expect(locator).toHaveValue(valorEsperado, { timeout: 5000 });

      const valorEncontrado = (await locator.inputValue()).trim();
      console.info(`
        Texto validado com sucesso: 
        Encontrado = "${valorEncontrado}"  
            Esperado = "${valorEsperado}"`);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Texto não validado!`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Texto não validado!`, { cause: erro });
    }
  }

  async validarNumeroLocalExato(locator, numeroEsperado) {
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });

      const textoEsperado = String(numeroEsperado); // Converte o número para texto (string)
      await expect(locator).toHaveValue(textoEsperado);

      const textoEncontrado = (await locator.innerText()).trim();
      console.info(`
        Número validado com sucesso:
        Encontrado = "${textoEncontrado}"
          Esperado = "${textoEsperado}"`);

    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Número não validado!`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Número não validado!`, { cause: erro });
    }
  }

  async aguardarTelaEstabilizar(locator, timeout = 7000) {
    // espera elemento estar visível na página
    await locator.waitFor({ state: 'visible', timeout });

    // elementHandle -> garante controle direto sobre o elemento real no DOM
    const elementoReal = await locator.elementHandle();

    if (!elementoReal) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Elemento não estável`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Elemento não estável`);
    }

    // valida estabilidade, tamanho e posição > 0
    await this.page.waitForFunction(
      elemento => {
        const dimensoes = elemento.getBoundingClientRect();
        return dimensoes.width > 0 && dimensoes.height > 0;
      },
      elementoReal // passa o elemento estável e não o locator
    );

    // pequeno tempo adicional
    await this.page.waitForTimeout(300);
  }

  async adicionarArquivoComClickBotao(locatorButton, caminho) {
    // Simula o click no botão do upload e captura o seletor de arquivos sem abrir a janela do SO
    // Promise.all - faz o waitForEvent executar antes do click no botão, garantindo a captura do seletor de arquivos (filechooser)
    const [fileChooser] = await Promise.all([this.page.waitForEvent('filechooser'), locatorButton.click(),]);

    // Envia o arquivo para o input associado ao botão
    // dispara o evento change automaticamente para que o upload aconteça
    await fileChooser.setFiles(caminho);

    // Move o mouse para o body para que qualquer popup desapareça
    await this.page.locator('body').hover();
  }

  async validarImagemCarregadaECapturarDimensoes(locator, descricao) {
    try {
      // Aguarda a imagem aparecer no DOM e ficar visível
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      // Espera o src deixar de ser o placeholder (qualquer coisa que não termine com .gif)
      await expect(locator).not.toHaveAttribute('src', /spacer\.gif/, { timeout: 7000 });
      // Captura o src final
      const srcImagem = await locator.getAttribute('src');

      if (!srcImagem) {
        throw new Error(`Imagem (${descricao}) não possui atributo src no DOM.`);
      }

      /*
            // Captura dimensões da imagem
            const dimensoes = await locatorImagem.evaluate(img => ({
              largura: img.naturalWidth,
              altura: img.naturalHeight
            }));
            */

      // Captura dimensões da imagem, garantindo que ela terminou de carregar
      const dimensoes = await locator.evaluate(async (img) => {
        // Retorna uma Promise que resolve quando a imagem estiver carregada
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          return { largura: img.naturalWidth, altura: img.naturalHeight };
        }
        return new Promise((resolve, reject) => {
          img.onload = () => resolve({ largura: img.naturalWidth, altura: img.naturalHeight });
          img.onerror = () => reject(new Error('Falha ao carregar a imagem'));
        });
      });

      console.info(`
        Imagem (${descricao}) carregada com sucesso (${dimensoes.largura}x${dimensoes.altura}px)`);

      // RETORNA as dimensões
      return dimensoes;

    } catch (erro) {
      console.error(`Erro ao validar Upload da imagem (${descricao}).`);
      throw new Error(`Erro ao validar Upload da imagem (${descricao}).`, { cause: erro });
    }
  }

  async validarDimensoesImagem(dimensoes, limiteLargura, limiteAltura, descricaoImg) {
    // Garante que as dimensões foram recebidas
    if (!dimensoes) {
      throw new Error(`Não foi possível obter as dimensões da imagem (${descricaoImg}).`);
    }

    const { largura, altura } = dimensoes;
    const erros = [];
    // Verifica largura
    if (largura < limiteLargura) {
      erros.push(`Largura da imagem (${descricaoImg}) menor que o esperado: ${largura}px`);
    }
    // Verifica altura
    if (altura < limiteAltura) {
      erros.push(`Altura da imagem (${descricaoImg}) menor que o esperado: ${altura}px`);
    }
    // Se houver qualquer erro, quebra o teste
    if (erros.length > 0) {
      console.error(
        `Imagem (${descricaoImg}) fora do padrão esperado.\n` +
        `Dimensões recebidas: ${largura}x${altura}px\n` +
        `Problema(s): ${erros.join(' | ')}`
      );
      throw new Error(
        `Imagem (${descricaoImg}) fora do padrão esperado.\n` +
        `Dimensões recebidas: ${largura}x${altura}px\n` +
        `Problema(s): ${erros.join(' | ')}`
      );
    }

    console.info(`
      Dimensões da imagem (${descricaoImg}) dentro do padrão, maior que o mínimo de: ${limiteLargura}px Largura e ${limiteAltura}px Altura`);
  }

  async validarParteTextoExatoComRegExp(locator, textoEsperado) {
    // METODO QUE VALIDA TEXTO EXATO POR LOCATOR, MAS DIFERENTE DO MÉTODO validarTextoLocalExato
    // ESTE VALIDA PARTE DE UM TEXTO QUE ESTÁ CONTIDO EM UM LOCATOR QUE TEM EMOGI OU CARACTERES ESPECIAIS
    // USAR TBM QUANDO QUISER VALIDAR SE O TEXTO ESTÁ CONTIDO EM UM LOCATOR ESPECÍFICO, MAS QUE TEM OUTROS CONTEÚDOS QUE NÃO PRECISAM VALIDAR
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });
      // função local para escapar caracteres especiais de regex
      const escapeRegExp = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // converte string em RegExp automaticamente para suportar padrões parciais e textos com caracteres especiais
      const esperado = typeof textoEsperado === "string"
        ? new RegExp(escapeRegExp(textoEsperado))
        : textoEsperado;
      // valida o texto do elemento usando regex ou valor direto
      await expect(locator).toHaveText(esperado, { timeout: 5000 });
      // captura o texto real exibido na tela para logging
      const textoEncontrado = (await locator.innerText()).trim();
      // prepara o valor esperado para log, removendo escapes da regex para facilitar leitura
      const esperadoLog = esperado instanceof RegExp
        ? esperado.source
          .replace(/\\\./g, '.')
          .replace(/\\\//g, '/')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
        : esperado;

      console.info(`
        Texto validado com sucesso:
        Encontrado = "${textoEncontrado}"
            Esperado = "${esperadoLog}"`);

    } catch (erro) {
      console.error(`Texto não validado!`);
      throw new Error(`Texto não validado!`, { cause: erro });
    }

  }

  gerarCodigoAleatorio_abc12345() {
    // Método síncrono, não há await nem operação assíncrona que precise usar async, ele retorna a string imediatamente.
    // CODIGO COMEÇA COM LETRAS E TERMINA COM NUMEROS
    // Gera 3 letras aleatórias (a-z)
    const letras = 'abcdefghijklmnopqrstuvwxyz';
    let codigoLetras = '';
    for (let i = 0; i < 3; i++) {
      codigoLetras += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    // Gera 5 números aleatórios (0-9)
    let codigoNumeros = '';
    for (let i = 0; i < 5; i++) {
      codigoNumeros += Math.floor(Math.random() * 10);
    }

    const codigoFinal = `${codigoLetras}${codigoNumeros}`;
    console.info(`Código gerado: ${codigoFinal}`);
    // Retorna concatenado: abc12345
    return codigoFinal;
  }

  gerarCodigoAleatorio_12345abc() {
    // Método síncrono, não há await nem operação assíncrona que precise usar async, ele retorna a string imediatamente.
    // CODIGO COMEÇA COM NUMEROS E TERMINA COM LETRAS
    // Gera 3 letras aleatórias (a-z)
    const letras = 'abcdefghijklmnopqrstuvwxyz';
    let codigoLetras = '';
    for (let i = 0; i < 3; i++) {
      codigoLetras += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    // Gera 5 números aleatórios (0-9)
    let codigoNumeros = '';
    for (let i = 0; i < 5; i++) {
      codigoNumeros += Math.floor(Math.random() * 10);
    }

    const codigoFinal = `${codigoNumeros}${codigoLetras}`;
    console.info(`Código gerado: ${codigoFinal}`);
    // Retorna concatenado: 12345abc
    return codigoFinal;
  }

  async buscarElementoPorNomeComPaginacao(locatorElemento, nomeElemento, locatorBotaoProximaPag) {

    while (true) {
      const count = await locatorElemento.count();

      //verificar se elemento foi encontrado na pagina atual, se encontrado, valida o texto exato e retorna true
      if (count > 0) {
        await this.validarTextoLocalExato(locatorElemento, nomeElemento);
        return true;
      }

      //se não encontrado
      //verifica se ainda o botão próxima página, existe e está habilitado no DOM
      const botaoExiste = await locatorBotaoProximaPag.count() > 0;
      const botaoExiteHabilitado = botaoExiste && await locatorBotaoProximaPag.isEnabled();

      //se botão próxima página existir e estiver habilitado, clica
      if (botaoExiteHabilitado) {
        console.info(`
          Elemento não encontrado nesta página. Indo para a próxima...`);
        await locatorBotaoProximaPag.click();

        //aguardar atualização da tabela
        await this.page.waitForTimeout(1000);

      } else { //se não, quebra loop 
        break;
      }
    }
    //retorna false com mensagem de erro
    console.error('Elemento não encontrado na paginação.');
    throw new Error('Elemento não encontrado na paginação.');
  }

  async validarStatusCode200PorURL(endpoint, descricao) {
    try {
      // Aguarda uma resposta de rede cuja URL contenha o trecho informado no endpoint.
      // scr = url encontrada no html, pode ser de vídeo ou imagem ou arquivo
      const response = await this.page.waitForResponse((response) =>
        response.url().includes(endpoint)
      );

      const infos = {
        url: response.url(),
        status: response.status(),
        ok: response.ok(),
      };

      // Valida se o status é 200 (OK).
      expect(infos.status).toBe(200);
      // Mantém a validação padrão de sucesso HTTP do Playwright.
      expect(infos.ok).toBe(true);

      console.info(`
        Arquivo validado com sucesso: ${descricao}
        URL Encontrada = ${infos.url}
        Status Code Encontrado = ${infos.status}
        Status OK = ${infos.ok}
      `);
      return infos;
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(
        `Falha ao validar Arquivo: ${descricao} ${endpoint}`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(
        `Falha ao validar Arquivo: ${descricao} ${endpoint}`, { cause: erro });
    }
  }

  async baixarArquivoComClickBotao(locatorBotaoDownload) {
    try {
      // Dispara o clique no botão e captura o evento de download na mesma ação.
      // Promise.all evita condição de corrida, garantindo que o listener do download
      // esteja ativo antes do clique acontecer.
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        locatorBotaoDownload.click()
      ]);
      // esse return é o que vai ser informado como parâmetro no método validarDownloadArquivo
      return download;
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error('Falha ao realizar download do arquivo.');
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error('Falha ao realizar download do arquivo.', { cause: erro });
    }
  }

  async validarDownloadArquivo(download, extensaoEsperada, descricao) {
    try {
      // Valida se o download foi realizado com sucesso, não pode ter falha.
      const falhaDownload = await download.failure();
      expect(falhaDownload).toBeNull();

      // Valida se a extensão recebida foi a esperada.
      // Aceita informar extensão com ou sem ponto e sem depender de maiúsculas/minúsculas.
      // Exemplos válidos para o parâmetro extensaoEsperada: "pdf", ".pdf", "csv", ".zip", "xlsx", "json", "xml", "txt", "png", "jpg".
      const extensaoNormalizada = extensaoEsperada.startsWith('.')
        ? extensaoEsperada.toLowerCase()
        : `.${extensaoEsperada.toLowerCase()}`;

      // Extrai somente a extensão do arquivo baixado.
      const extensaoRecebida = path.extname(download.suggestedFilename().toLowerCase());

      // Compara a extensão recebida com a extensão esperada.
      expect(extensaoRecebida).toBe(extensaoNormalizada);

      // Usa arquivo temporário gerenciado pelo Playwright.
      const caminhoArquivoTemporario = await download.path();

      // Valida se o arquivo tem tamanho maior que zero.
      const informacoesArquivo = fs.statSync(caminhoArquivoTemporario);
      expect(informacoesArquivo.size).toBeGreaterThan(0);

      console.info(`
        Download validado com sucesso: ${descricao}
        Nome arquivo = ${download.suggestedFilename().toLowerCase()}
        Extensão Esperada = ${extensaoNormalizada}
        Extensão Recebida = ${extensaoRecebida}
        Tamanho Arquivo = ${informacoesArquivo.size} bytes
      `);

      return {
        extensaoEsperada: extensaoNormalizada,
        extensaoRecebida,
        caminhoArquivo: caminhoArquivoTemporario,
        tamanhoArquivo: informacoesArquivo.size,
      };
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Falha ao validar download do arquivo: ${descricao}`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Falha ao validar download do arquivo: ${descricao}`, { cause: erro });
    }
  }

  async capturarBufferArquivoComClickBotao(locatorAcao, endpoint, tipoArquivo) {
    // Buffer é o conteúdo bruto de um arquivo em memória, em bytes. 
    // Nesse fluxo: o método baixa o arquivo (PDF), guarda isso em um bufferArquivo, 
    // depois você valida assinatura (%PDF), que aparece no devtools (Network -> Response)
    //  e extrai texto desse conteúdo, sem precisar salvar no disco.

    // Defaults internos: assim a chamada do método fica simples (locator + endpoint + tipoArquivo).
    const timeoutResposta = 30000;
    const statusEsperado = 200;
    const regexUrlArquivoNoHtml = /original-url="([^"]+)"/i;
    const mensagemSemResposta = `Nenhuma resposta capturada para ${endpoint}`;

    // Normaliza o tipo recebido para evitar variações como " PDF ", "Pdf", etc.
    const tipoArquivoNormalizado = String(tipoArquivo || '').trim().toLowerCase();

    // Assinatura esperada do arquivo (magic bytes), ex.: pdf -> %PDF.
    const magicEsperado = `%${tipoArquivoNormalizado}`.toUpperCase();

    // Define Accept por tipo, mas mantém fallback genérico para tipos não mapeados.
    const acceptHeaderPorTipo = {
      pdf: 'application/pdf,application/octet-stream,*/*',
      csv: 'text/csv,application/octet-stream,*/*',
      xml: 'application/xml,text/xml,application/octet-stream,*/*',
      json: 'application/json,text/plain,application/octet-stream,*/*',
      txt: 'text/plain,application/octet-stream,*/*',
      zip: 'application/zip,application/octet-stream,*/*',
    };
    const acceptHeader = acceptHeaderPorTipo[tipoArquivoNormalizado] || 'application/octet-stream,*/*';

    if (!endpoint) {
      throw new Error('Parâmetro "endpoint" é obrigatório para capturar a resposta HTML.');
    }

    if (!tipoArquivoNormalizado) {
      throw new Error('Parâmetro "tipoArquivo" é obrigatório para capturar o buffer do arquivo.');
    }

    // Captura a resposta do endpoint e dispara o clique no mesmo instante,
    // evitando perder respostas rápidas de rede.
    const [htmlResponse] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes(endpoint) && resp.status() === statusEsperado,
        { timeout: timeoutResposta }
      ),
      locatorAcao.click(),
    ]);

    if (!htmlResponse) {
      throw new Error(mensagemSemResposta);
    }

    // O endpoint retorna HTML do visualizador; daqui extraímos a URL real do arquivo.
    const htmlBuffer = await htmlResponse.body();
    const htmlText = htmlBuffer.toString('utf-8');
    const matchUrlArquivo = htmlText.match(regexUrlArquivoNoHtml);
    const urlArquivo = matchUrlArquivo?.[1] || htmlResponse.url();

    let bufferArquivo = null;
    let status = null;
    let origemCaptura = 'request';

    try {
      // Caminho principal: download direto via APIRequestContext do Playwright.
      const responseArquivo = await this.page.request.get(urlArquivo, {
        headers: {
          Accept: acceptHeader,
        },
      });

      bufferArquivo = await responseArquivo.body();
      status = responseArquivo.status();
    } catch {
      // Fallback: baixa no contexto do navegador (com cookies/sessão da página atual).
      origemCaptura = 'fetch-browser';

      const resultadoFetch = await this.page.evaluate(async ({ url, accept }) => {
        const resposta = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: accept,
          },
        });

        const arrayBuffer = await resposta.arrayBuffer();
        return {
          status: resposta.status,
          bytes: Array.from(new Uint8Array(arrayBuffer)),
        };
      }, { url: urlArquivo, accept: acceptHeader });

      bufferArquivo = Buffer.from(resultadoFetch.bytes);
      status = resultadoFetch.status;
    }

    // Primeiro guard-rail: status HTTP esperado.
    if (status !== statusEsperado) {
      throw new Error(`Resposta capturada não está com status esperado. Origem=${origemCaptura} Status=${status} Esperado=${statusEsperado}`);
    }

    // Segundo guard-rail: assinatura do arquivo nos primeiros bytes (magic bytes).
    const magic = bufferArquivo.toString('utf-8', 0, String(magicEsperado).length);
    if (magic !== magicEsperado) {
      throw new Error(`Resposta capturada não possui assinatura esperada. Origem=${origemCaptura} Status=${status} Magic=${magic} Esperado=${magicEsperado}`);
    }

    // Retorna buffer + metadados úteis para troubleshooting e reuso.
    return {
      bufferArquivo,
      status,
      origemCaptura,
      urlArquivo,
      urlRespostaHtml: htmlResponse.url(),
      htmlText,
    };
  }

  async validarTextoPdfBuffer(buffer, textoEsperado, descricao) {
    try {
      // Validação rápida: antes de parsear, confirma se o conteúdo começa com %PDF.
      const magic = buffer.toString('utf-8', 0, 4);
      if (magic !== '%PDF') {
        throw new Error(`Buffer recebido não é PDF válido (magic bytes: ${magic}).`);
      }

      // Extrai texto de um buffer de PDF em memória.
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const resultado = await parser.getText();
      const dadosPdf = resultado;

      // Normaliza espaços para reduzir falsos negativos causados por layout/quebras de linha.
      // Normaliza espaços para evitar falso negativo por quebra de linha/layout do PDF.
      const textoExtraido = (dadosPdf?.text || '').replace(/\s+/g, ' ').trim();
      const textoEsperadoNormalizado = String(textoEsperado).replace(/\s+/g, ' ').trim();

      // Procura especificamente pelo campo "Nome completo:" e extrai o valor.
      const matchNome = textoExtraido.match(/Nome\s+completo:\s*(.+)/i);
      let nomeCompletoEncontrado = '';
      if (matchNome) {
        // Pega tudo após "Nome completo:" e faz split na primeira ocorrência de underscores ou múltiplos espaços
        const nomeRaw = matchNome[1];
        nomeCompletoEncontrado = nomeRaw.split(/\s{2,}|__+/)[0].trim();
      }

      // Validação exata do nome completo extraído.
      if (!nomeCompletoEncontrado) {
        throw new Error(`Campo "Nome completo:" não encontrado no PDF.`);
      }

      // Regra do teste: o valor extraído deve ser exatamente igual ao esperado.
      expect(nomeCompletoEncontrado).toBe(textoEsperadoNormalizado);

      console.info(`
        Variável validada no Arquivo Gerado: ${descricao || 'sem descrição'}`);
      console.info(`
        Texto validado com sucesso: 
        Encontrado = "${nomeCompletoEncontrado}"  
            Esperado = "${textoEsperadoNormalizado}"
      `);
    } catch (erro) {
      // Em caso de falha, tenta extrair um preview de texto para facilitar diagnóstico no relatório.
      console.error(`Falha ao validar texto no conteúdo do PDF: ${descricao || 'sem descrição'}`);
      let textoExtraidoPreview = '';

      try {
        const { PDFParse } = await import('pdf-parse');
        const parserDebug = new PDFParse({ data: buffer });
        const resultadoDebug = await parserDebug.getText();
        textoExtraidoPreview = (resultadoDebug?.text || '').replace(/\s+/g, ' ').trim().slice(0, 400);
      } catch {
        textoExtraidoPreview = 'Nao foi possivel extrair texto para preview.';
      }

      throw new Error(`Falha ao validar texto no conteúdo do PDF: ${descricao || 'sem descrição'}. Esperado="${String(textoEsperado)}". Extraido(preview)="${textoExtraidoPreview}"`, { cause: erro });
    }
  }

  async aguardarDomZKEstabilizar(timeout = 7000, janelaEstabilidadeMs = 350) {
    // MÉTODO EM VALIDAÇÃO QUALQUER PROBLEMA RELATAR AO TIME QA (GAC)
    await this.page.waitForFunction(
      ({ janelaEstabilidadeMs, inicioEspera }) => {
        if (!document.documentElement) return false;

        // Reinstala no novo documento quando uma navegacao ocorre durante a espera.
        if (!window.__zkObserverInstalado) {
          const observer = new MutationObserver(() => {
            window.__zkUltimaMutacao = Date.now();
          });
          observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
          });
          window.__zkUltimaMutacao = Date.now();
          window.__zkObserverInstalado = true;
        }

        const agora = Date.now();
        const ultimaMutacao = Math.max(window.__zkUltimaMutacao, inicioEspera);
        const domSilencioso = agora - ultimaMutacao >= janelaEstabilidadeMs;
        const documentoPronto = document.readyState !== 'loading';
        const jqueryOcioso = !(window.jQuery?.active > 0);
        const zkCarregando = Boolean(window.zk?.mounting) || window.zk?.loading > 0;

        // ZK: tenta detectar estado de processamento AJAX.
        const zAu = window.zAu;
        const zAuProcessando = (() => {
          if (!zAu) return false;

          const estadoProcessing = typeof zAu.processing === 'function'
            ? zAu.processing()
            : zAu.processing;
          const processing = typeof estadoProcessing === 'number'
            ? estadoProcessing > 0
            : Boolean(estadoProcessing);

          const filaPendencias = Array.isArray(zAu.cmdsQue)
            ? zAu.cmdsQue.length > 0
            : false;

          return processing || filaPendencias;
        })();

        const seletoresLoadingZk = [
          '.z-loading',
          '.z-loading-indicator',
          '.z-apply-mask',
          '.z-temp',
          "[aria-busy='true']",
        ];

        const loadingVisivel = seletoresLoadingZk.some((seletor) =>
          Array.from(document.querySelectorAll(seletor)).some((el) => {
            const estilo = window.getComputedStyle(el);
            return (
              estilo &&
              estilo.display !== 'none' &&
              estilo.visibility !== 'hidden' &&
              el.getClientRects().length > 0
            );
          })
        );

        return documentoPronto && jqueryOcioso && !zkCarregando && !zAuProcessando && !loadingVisivel && domSilencioso;
      },
      { janelaEstabilidadeMs, inicioEspera: Date.now() },
      { timeout }
    );
  }

  async aguardarDomAngularEstabilizar(timeout = 7000, janelaEstabilidadeMs = 350) {
    // MÉTODO EM VALIDAÇÃO QUALQUER PROBLEMA RELATAR AO TIME QA (GAC)
    await this.page.waitForLoadState('domcontentloaded');

    // Instala observer uma única vez por página para medir "silêncio" do DOM.
    await this.page.evaluate(() => {
      if (window.__ngObserverInstalado) {
        return;
      }

      window.__ngObserverInstalado = true;
      window.__ngUltimaMutacao = Date.now();

      const observer = new MutationObserver(() => {
        window.__ngUltimaMutacao = Date.now();
      });

      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    });

    await this.page.waitForFunction(
      ({ janelaEstabilidadeMs }) => {
        const agora = Date.now();
        const ultimaMutacao = window.__ngUltimaMutacao || agora;
        const domSilencioso = agora - ultimaMutacao >= janelaEstabilidadeMs;
        const documentoPronto = document.readyState !== 'loading';
        const jqueryOcioso = !window.jQuery || window.jQuery.active === 0;

        // Quando disponível, usa a API de testabilidade do Angular para confirmar estabilidade.
        const testabilities = typeof window.getAllAngularTestabilities === 'function'
          ? window.getAllAngularTestabilities()
          : null;

        const angularEstavel = Array.isArray(testabilities) && testabilities.length > 0
          ? testabilities.every((testability) => {
            try {
              return typeof testability.isStable === 'function' ? testability.isStable() : true;
            } catch {
              return false;
            }
          })
          : true;

        const seletoresLoading = [
          '.mat-progress-spinner',
          '.mat-mdc-progress-spinner',
          '.mat-spinner',
          '.mat-progress-bar',
          '.mat-mdc-progress-bar',
          '.cdk-overlay-backdrop-showing',
          "[aria-busy='true']",
          '.ngx-spinner-overlay',
          '.spinner',
          '.loading',
        ];

        const loadingVisivel = seletoresLoading.some((seletor) =>
          Array.from(document.querySelectorAll(seletor)).some((el) => {
            const estilo = window.getComputedStyle(el);
            return (
              estilo &&
              estilo.display !== 'none' &&
              estilo.visibility !== 'hidden' &&
              el.getClientRects().length > 0
            );
          })
        );

        return documentoPronto && jqueryOcioso && angularEstavel && !loadingVisivel && domSilencioso;
      },
      { janelaEstabilidadeMs },
      { timeout }
    );
  }

  async aguardarDomRichFacesEstabilizar(timeout = 7000, janelaEstabilidadeMs = 350) {
    await this.page.waitForLoadState('domcontentloaded');

    // Instala observer uma única vez por página para medir "silêncio" do DOM.
    await this.page.evaluate(() => {
      if (window.__rfObserverInstalado) {
        return;
      }

      window.__rfObserverInstalado = true;
      window.__rfUltimaMutacao = Date.now();

      const observer = new MutationObserver(() => {
        window.__rfUltimaMutacao = Date.now();
      });

      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    });

    await this.page.waitForFunction(
      ({ janelaEstabilidadeMs }) => {
        const agora = Date.now();
        const ultimaMutacao = window.__rfUltimaMutacao || agora;
        const domSilencioso = agora - ultimaMutacao >= janelaEstabilidadeMs;
        const documentoPronto = document.readyState !== 'loading';
        const jqueryOcioso = !window.jQuery || window.jQuery.active === 0;

        const seletoresLoading = [
          "img[alt='Carregando...']",
          '.rf-ajax-loading',
          '.rf-st-start',
          "[id*='status']",
        ];

        const loadingVisivel = seletoresLoading.some((seletor) =>
          Array.from(document.querySelectorAll(seletor)).some((el) => {
            const estilo = window.getComputedStyle(el);
            return (
              estilo &&
              estilo.display !== 'none' &&
              estilo.visibility !== 'hidden' &&
              el.getClientRects().length > 0
            );
          })
        );

        return documentoPronto && jqueryOcioso && !loadingVisivel && domSilencioso;
      },
      { janelaEstabilidadeMs },
      { timeout }
    );
  }

  async validarTextoModalRichFacesLocalExato(locator, textoEsperado) {
    try {
      // Aguarda elemento existir no DOM sem verificar visibilidade CSS
      // Necessário para modais RichFaces que o Playwright não reconhece como "visíveis" por CSS
      await locator.waitFor({ state: 'attached', timeout: 10000 });
      // Valida o texto do elemento sem exigir visibilidade CSS
      await expect(locator).toHaveText(textoEsperado, { timeout: 5000 });

      // textContent() funciona em elementos hidden; innerText() exige renderização visível
      const textoEncontrado = (await locator.textContent()).trim();
      console.info(`
        Texto validado com sucesso: 
        Encontrado = "${textoEncontrado}"  
            Esperado = "${textoEsperado}"`);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Texto não validado!`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Texto não validado!`, { cause: erro });
    }
  }

  gerarValorAleatorioFormatoBReAmericano(valor) {// Sem valor informado, sorteia entre R$ 0,01 e R$ 1.000,00, incluindo os limites.
    // Método síncrono, não há await nem operação assíncrona que precise usar async, ele retorna a string imediatamente.    
    /*
    --> Para usar um valor específico, informe no método, conforme abaixo:
    --> crie a variável em dadosBasicos.json, exemplo → "vlr_125_50": 125.50 ---> Não use separador por vírgula, use ponto (.) como no exemplo
    --> crie a const do novo valor e informe a variável no método
    const { valores } = dados; 
    const valorGerado = helpersPage.gerarValorAleatorioFormatoBReAmericano(valores.vlr_125_50);
    await this.helpersPage.preencherCampoEscrevendoTexto(inputTabela, valorGerado.formatoBR);
    ---> No método de preencher, informe a const criada (valorGerado), no formato desejado: 
    ---> valorGerado.formatoBR = "125,50" ou valorGerado.formatoAmericano = "125.50"
    */
    const valorNumerico = valor === undefined
      ? (Math.floor(Math.random() * 100000) + 1) / 100
      : valor;
    const opcoesFormato = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    const valorFormatado = {
      formatoBR: valorNumerico.toLocaleString('pt-BR', opcoesFormato),
      formatoAmericano: valorNumerico.toLocaleString('en-US', opcoesFormato),
    };
    console.info(`Valor gerado: formatoBR = ${valorFormatado.formatoBR} | formatoAmericano = ${valorFormatado.formatoAmericano}`);
    return valorFormatado;
  }

  async forcarClickComEvaluateValidarInput(locatorClick, locatorCampoInput, descricao) {
    // NÃO USAR DE FORMA ROTINEIRA, APENAS EM CASOS ESPECIAIS DE ELEMENTOS QUE NÃO RESPONDEM AO CLICK NORMAL DO PLAYWRIGHT
    try {
      // Força o click no elemento usando evaluate, mesmo que esteja coberto ou fora da viewport
      await locatorClick.evaluate(elemento => elemento.click());
      await expect(locatorCampoInput).toHaveValue(descricao, { timeout: 5000 });
      console.info(`
        Elemento "${descricao}" aparece no campo após click.`);
    } catch (erro) {
      // quebra o teste e mensagem aparece no final do relatório em "Attachments -> stderr"
      console.error(`Falha ao clicar no elemento: ${descricao}`);
      // mensagem que aparece na aba "Errors" da UI do PlayWright
      throw new Error(`Falha ao clicar no elemento: ${descricao}`, { cause: erro });
    }
  }

    gerarCpfAleatorioComESemMascara() {
    // Método síncrono, não há await nem operação assíncrona que precise usar async, ele retorna a string imediatamente.
    const digitos_11 = (numeros) => {
      let soma = 0;

      for (let i = 0; i < numeros.length; i++) {
        soma += numeros[i] * ((numeros.length + 1) - i);
      }

      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const numeros = [];

    for (let i = 0; i < 9; i++) {
      numeros.push(Math.floor(Math.random() * 10));
    }

    numeros.push(digitos_11(numeros));
    numeros.push(digitos_11(numeros));

    const semMascara = numeros.join('');
    const comMascara = semMascara.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
    const cpf = {
      comMascara: comMascara,
      semMascara: semMascara
    };
    console.info(`CPF Gerado: ${cpf.comMascara}`);

    return cpf;
  }
}
