const { getUsers } = require('./database/firebase');

async function debugAuth() {
  try {
    console.log('🔍 Debugando autenticação...');
    
    // Testar com a senha que você mencionou
    const testLogin = 'aluno001';
    const testPassword = 'teste123';
    
    console.log(`🧪 Testando login: ${testLogin}`);
    console.log(`🔑 Senha fornecida: ${testPassword}`);
    
    // Buscar usuário no Firebase
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📋 Total de usuários: ${usersArray.length}`);
    
    // Encontrar usuário específico
    const user = usersArray.find(u => u.login === testLogin);
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      console.log('📝 Usuários disponíveis:');
      usersArray.forEach(u => console.log(`  - ${u.login}`));
      return;
    }
    
    console.log('\n✅ Usuário encontrado:');
    console.log(`  - ID: ${user.id}`);
    console.log(`  - Login: ${user.login}`);
    console.log(`  - XP: ${user.xp_atual}`);
    console.log(`  - Senha no Firebase: ${user.senha ? 'Definida' : 'Não definida'}`);
    
    if (user.senha) {
      console.log(`  - Senha no Firebase: "${user.senha}"`);
      
      // Testar verificação de senha
      console.log('\n🔐 Testando verificação de senha...');
      const isValidPassword = testPassword === user.senha;
      console.log(`  - Senha válida: ${isValidPassword ? '✅ Sim' : '❌ Não'}`);
      
      if (!isValidPassword) {
        console.log('\n🔍 Debugando problema...');
        console.log(`  - Senha fornecida: "${testPassword}"`);
        console.log(`  - Senha no Firebase: "${user.senha}"`);
        console.log(`  - Comprimento da senha fornecida: ${testPassword.length}`);
        console.log(`  - Comprimento da senha no Firebase: ${user.senha.length}`);
        console.log(`  - São iguais: ${testPassword === user.senha ? 'Sim' : 'Não'}`);
        
        // Testar com senha "123" (padrão)
        const testDefaultPassword = '123' === user.senha;
        console.log(`  - Senha "123" válida: ${testDefaultPassword ? '✅ Sim' : '❌ Não'}`);
      }
    } else {
      console.log('\n⚠️ Usuário sem senha definida no Firebase');
      console.log('💡 Execute update-simple-passwords.js para definir senhas');
    }
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  debugAuth();
}

module.exports = { debugAuth }; 