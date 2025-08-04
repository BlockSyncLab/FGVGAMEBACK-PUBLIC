const { getUsers } = require('./database/firebase');

async function testUserData() {
  try {
    console.log('🔍 Testando dados dos usuários...');
    
    // Buscar usuários no Firebase
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📊 Total de usuários: ${usersArray.length}`);
    
    // Verificar se há usuários com série undefined
    const usersWithUndefinedSerie = usersArray.filter(user => !user.serie || user.serie === 'undefined');
    
    console.log(`⚠️ Usuários com série undefined: ${usersWithUndefinedSerie.length}`);
    
    if (usersWithUndefinedSerie.length > 0) {
      console.log('\n📋 Usuários com problema:');
      usersWithUndefinedSerie.slice(0, 5).forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.login}:`);
        console.log(`     - Série: "${user.serie}"`);
        console.log(`     - Escola: "${user.escola}"`);
        console.log(`     - Turma: "${user.turma}"`);
      });
    }
    
    // Verificar usuários com dados corretos
    const usersWithCorrectSerie = usersArray.filter(user => user.serie && user.serie !== 'undefined');
    
    console.log(`\n✅ Usuários com série correta: ${usersWithCorrectSerie.length}`);
    
    if (usersWithCorrectSerie.length > 0) {
      console.log('\n📋 Exemplo de usuário correto:');
      const correctUser = usersWithCorrectSerie[0];
      console.log(`  - Login: ${correctUser.login}`);
      console.log(`  - Nome: ${correctUser.nome}`);
      console.log(`  - Escola: ${correctUser.escola}`);
      console.log(`  - Série: ${correctUser.serie}`);
      console.log(`  - Turma: ${correctUser.turma}`);
      console.log(`  - XP: ${correctUser.xp_atual}`);
    }
    
    console.log('\n💡 Solução:');
    console.log('1. Se há usuários com série undefined, execute o script de recriação');
    console.log('2. Se todos os usuários estão corretos, o problema pode estar no localStorage do frontend');
    console.log('3. Para limpar o localStorage, abra o console do navegador e execute:');
    console.log('   localStorage.removeItem("user");');
    console.log('4. Depois faça login novamente');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

if (require.main === module) {
  testUserData();
}

module.exports = { testUserData }; 