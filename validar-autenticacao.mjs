#!/usr/bin/env node

/**
 * Script de validação da configuração de autenticação por papel
 * Uso: PAPEL_AUTENTICADO=gestor node validar-autenticacao.mjs
 * 
 * Totalmente independente: importa dinamicamente todas as informações de config/usuarios.js
 * Novos papéis adicionados em usuarios.js são reconhecidos automaticamente
 */

import {
  obterPapelAutenticado,
  obterUsuarioPorPapel,
  obterPapeisDisponiveis,
  obterUsuarios,
  obterCaminhoArmazenamentoEstado
} from './config/usuarios.js';

// Valida a configuração
try {
  const papel = obterPapelAutenticado();
  const usuario = obterUsuarioPorPapel(papel);
  const usuariosPorPapel = obterUsuarios();
  const papeisDisponiveis = obterPapeisDisponiveis();

  console.log('\nConfiguracao de autenticacao validada com sucesso!\n');
  console.log('Papel autenticado:', usuario.papel);
  console.log('CPF:', usuario.cpf);
  console.log('Nome:', usuario.nome);
  console.log('StorageState:', obterCaminhoArmazenamentoEstado('hml', usuario.papel));
  
  console.log('\nPapeis disponiveis:');
  papeisDisponiveis.forEach((papel) => {
    const user = usuariosPorPapel[papel];
    console.log(`  - ${papel}: ${user.nome}`);
  });
  
  console.log('\nPronto para rodar testes!\n');
  process.exit(0);
} catch (erro) {
  console.error('\nErro na validacao:', erro.message, '\n');
  process.exit(1);
}
