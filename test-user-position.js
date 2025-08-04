const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, getUserById } = require('./database/firebase');

async function testUserPosition() {
  try {
    console.log('🧪 Testando posição do usuário...');
    
    // Simular um usuário logado
    const testUserId = 1; // aluno001
    const user = await getUserById(testUserId);
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log(`✅ Usuário encontrado: ${user.login}`);
    console.log(`📊 XP atual: ${user.xp_atual}`);
    console.log(`📈 Nível calculado: ${Math.floor(user.xp_atual / 50) + 1}`);
    
    // Buscar todos os usuários
    const allUsers = await getUsers();
    const usersArray = Object.values(allUsers || {});
    
    console.log(`📋 Total de usuários: ${usersArray.length}`);
    
    // Ordenar usuários por XP (maior para menor)
    const rankingGeral = usersArray
      .filter(u => u.xp_atual !== undefined)
      .sort((a, b) => (b.xp_atual || 0) - (a.xp_atual || 0));
    
    // Encontrar posição do usuário
    const posicao = rankingGeral.findIndex(u => u.id === user.id) + 1;
    
    console.log(`🏆 Posição no ranking: #${posicao} de ${rankingGeral.length}`);
    
    // Mostrar top 5 do ranking
    console.log('\n📊 Top 5 do Ranking:');
    rankingGeral.slice(0, 5).forEach((u, index) => {
      console.log(`  ${index + 1}. ${u.login} - ${u.xp_atual} XP`);
    });
    
    console.log('\n🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testUserPosition();
}

module.exports = { testUserPosition }; 