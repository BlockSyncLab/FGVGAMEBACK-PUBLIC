const { executeQuery } = require('./database/connection');

async function testDatabase() {
  try {
    console.log('🧪 Testando conexão com o banco de dados...');
    
    // Testar conexão básica
    const testResult = await executeQuery('SELECT 1 as test');
    console.log('✅ Conexão básica OK:', testResult);
    
    // Verificar se a tabela users existe
    const usersCount = await executeQuery('SELECT COUNT(*) as total FROM users');
    console.log('📊 Total de usuários:', usersCount);
    
    // Verificar se há usuários
    const users = await executeQuery('SELECT login, turma, escola FROM users LIMIT 3');
    console.log('👥 Primeiros usuários:', users);
    
    // Verificar se a tabela perguntas existe
    const perguntasCount = await executeQuery('SELECT COUNT(*) as total FROM perguntas');
    console.log('📚 Total de perguntas:', perguntasCount);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testDatabase(); 