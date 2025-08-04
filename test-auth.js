const bcrypt = require('bcryptjs');
const { executeQuery } = require('./database/connection');

async function testAuth() {
  try {
    console.log('🧪 Testando autenticação...');
    
    // Testar login de um usuário
    const testLogin = 'aluno001';
    const testPassword = '123';
    
    // Buscar usuário no banco
    const users = await executeQuery(
      'SELECT * FROM users WHERE login = ?',
      [testLogin]
    );
    
    if (users.length === 0) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    const user = users[0];
    console.log(`✅ Usuário encontrado: ${user.login}`);
    console.log(`📊 XP atual: ${user.xp_atual}`);
    console.log(`📈 Nível calculado: ${Math.floor(user.xp_atual / 50) + 1}`);
    
    // Testar verificação de senha
    const isValidPassword = await bcrypt.compare(testPassword, user.senha);
    console.log(`🔐 Senha válida: ${isValidPassword ? '✅ Sim' : '❌ Não'}`);
    
    if (isValidPassword) {
      console.log('🎉 Autenticação funcionando corretamente!');
    } else {
      console.log('⚠️ Senha inválida - execute update-passwords.js primeiro');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth }; 