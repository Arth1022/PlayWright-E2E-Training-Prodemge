import fs from 'fs';
import path from 'path';

// Define qual ambiente será usado (default: testeInteg)
// inserir nome do ambiente que deseja usar (ex: testeInteg, homo, dev), igual ao arquivo criado
const ENV = process.env.ENV || 'testeInteg'; 

// Monta o caminho do arquivo (ex: config/testeInteg.env.json)
const envPath = path.resolve(process.cwd(), `config/${ENV}.env.json`);

if (!fs.existsSync(envPath)) {
  throw new Error(`Arquivo de ambiente não encontrado: ${envPath}`);
}

// Lê e converte o JSON para objeto JS
const env = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

// log que vai aparecer no terminal
console.log('==============================');
console.log('AMBIENTE CARREGADO:', ENV);
console.log('==============================');

// Exporta variáveis do JSON + nome do ambiente
export default {
  ...env,
  ambiente: ENV
};
