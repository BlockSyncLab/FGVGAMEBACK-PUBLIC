const { getUsers } = require('./database/firebase');

async function testRankingAPIs() {
  try {
    console.log('🧪 Testando todas as APIs de ranking...');
    
    // Buscar todos os usuários
    const users = await getUsers();
    
    if (!users || Object.keys(users).length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    
    console.log(`📊 Total de usuários: ${Object.keys(users).length}`);
    
    // Simular dados de um usuário para teste
    const testUserId = Object.keys(users)[0];
    const testUser = users[testUserId];
    
    console.log('\n👤 Usuário de teste:');
    console.log(`  - ID: ${testUserId}`);
    console.log(`  - Login: ${testUser.login}`);
    console.log(`  - XP: ${testUser.xp_atual}`);
    console.log(`  - Turma: ${testUser.turma}`);
    console.log(`  - Escola: ${testUser.escola}`);
    
    // Testar cálculo de ranking geral
    console.log('\n📊 Testando ranking geral...');
    const usersArray = Object.values(users || {});
    
    // Ordenar usuários por XP (maior para menor)
    const rankingGeral = usersArray
      .filter(u => u.xp_atual !== undefined)
      .sort((a, b) => (b.xp_atual || 0) - (a.xp_atual || 0));
    
    console.log('Top 10 do ranking geral:');
    rankingGeral.slice(0, 10).forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.login} - XP: ${user.xp_atual}`);
    });
    
    // Testar cálculo de ranking por turma
    console.log('\n👥 Testando ranking por turma...');
    const turmasMap = {};
    
    usersArray.forEach(user => {
      const key = `${user.turma}-${user.escola}`;
      if (!turmasMap[key]) {
        turmasMap[key] = {
          turma: user.turma,
          escola: user.escola,
          totalEstudantes: 0,
          totalXp: 0
        };
      }
      
      turmasMap[key].totalEstudantes++;
      turmasMap[key].totalXp += user.xp_atual || 0;
    });
    
    // Calcular médias e ordenar
    const turmas = Object.values(turmasMap).map(turma => ({
      turma: turma.turma,
      escola: turma.escola,
      totalEstudantes: turma.totalEstudantes,
      mediaXp: turma.totalXp / turma.totalEstudantes
    })).sort((a, b) => b.mediaXp - a.mediaXp);
    
    console.log('Top 3 turmas:');
    turmas.slice(0, 3).forEach((turma, index) => {
      console.log(`  ${index + 1}. ${turma.turma} (${turma.escola}) - Média XP: ${Math.round(turma.mediaXp)}`);
    });
    
    // Testar posição da turma do usuário
    const userTurma = turmas.find(t => t.turma === testUser.turma && t.escola === testUser.escola);
    if (userTurma) {
      const posicaoTurma = turmas.findIndex(t => t.turma === testUser.turma && t.escola === testUser.escola) + 1;
      console.log(`\n🎯 Posição da turma do usuário: #${posicaoTurma} de ${turmas.length}`);
      console.log(`  - Turma: ${userTurma.turma}`);
      console.log(`  - Escola: ${userTurma.escola}`);
      console.log(`  - Média XP: ${Math.round(userTurma.mediaXp)}`);
    }
    
    // Simular respostas das APIs
    console.log('\n📋 Respostas simuladas das APIs:');
    
    // API /ranking/top3
    const top3Response = {
      success: true,
      top3: turmas.slice(0, 3).map((turma, index) => ({
        id: index + 1,
        turma: turma.turma,
        escola: turma.escola,
        mediaXp: Math.round(turma.mediaXp)
      }))
    };
    
    console.log('GET /ranking/top3:');
    console.log(JSON.stringify(top3Response, null, 2));
    
    // API /ranking/turma/{turma}/{escola}
    if (userTurma) {
      const turmaResponse = {
        success: true,
        turma: {
          posicao: turmas.findIndex(t => t.turma === testUser.turma && t.escola === testUser.escola) + 1,
          mediaXp: Math.round(userTurma.mediaXp)
        }
      };
      
      console.log(`\nGET /ranking/turma/${testUser.turma}/${testUser.escola}:`);
      console.log(JSON.stringify(turmaResponse, null, 2));
    }
    
    console.log('\n✅ Teste das APIs de ranking concluído!');
    
  } catch (error) {
    console.error('❌ Erro ao testar APIs de ranking:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testRankingAPIs();
}

module.exports = { testRankingAPIs }; 