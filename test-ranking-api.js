const { getUsers } = require('./database/firebase');
const jwt = require('jsonwebtoken');

async function testRankingAPI() {
  try {
    console.log('🧪 Testando API de ranking...');
    
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
    
    // Simular token JWT
    const token = jwt.sign(
      { id: testUserId },
      process.env.JWT_SECRET || 'ga_quiz_secret_key_2024_bahia_education',
      { expiresIn: '24h' }
    );
    
    console.log('\n🔐 Token gerado:', token.substring(0, 50) + '...');
    
    // Simular cálculo de ranking
    const usersArray = Object.values(users || {});
    
    // Ordenar usuários por XP (maior para menor)
    const rankingGeral = usersArray
      .filter(u => u.xp_atual !== undefined)
      .sort((a, b) => (b.xp_atual || 0) - (a.xp_atual || 0));
    
    console.log('\n📊 Ranking geral (top 10):');
    rankingGeral.slice(0, 10).forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.login} - XP: ${user.xp_atual}`);
    });
    
    // Encontrar posição do usuário de teste
    const posicao = rankingGeral.findIndex(u => u.id === testUser.id) + 1;
    
    console.log(`\n🎯 Posição do usuário de teste: #${posicao} de ${rankingGeral.length}`);
    
    // Simular resposta da API
    const apiResponse = {
      success: true,
      user: {
        id: testUser.id,
        login: testUser.login,
        nome: `Aluno ${testUser.login}`,
        xp: testUser.xp_atual || 0,
        nivel: Math.floor((testUser.xp_atual || 0) / 50) + 1,
        posicao: posicao,
        totalUsuarios: rankingGeral.length
      }
    };
    
    console.log('\n📋 Resposta simulada da API:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    // Verificar se há problemas
    if (posicao === 0) {
      console.log('\n❌ PROBLEMA: Usuário não encontrado no ranking!');
      console.log('   - Verificar se o ID está correto');
      console.log('   - Verificar se o XP está definido');
    } else if (posicao > rankingGeral.length) {
      console.log('\n❌ PROBLEMA: Posição inválida!');
    } else {
      console.log('\n✅ Ranking funcionando corretamente!');
    }
    
    // Verificar dados dos usuários
    console.log('\n🔍 Verificando dados dos usuários:');
    let problemas = 0;
    
    usersArray.forEach((user, index) => {
      if (user.xp_atual === undefined || user.xp_atual === null) {
        console.log(`  ⚠️ Usuário ${user.login}: XP não definido`);
        problemas++;
      }
      if (!user.id) {
        console.log(`  ⚠️ Usuário ${user.login}: ID não definido`);
        problemas++;
      }
    });
    
    if (problemas === 0) {
      console.log('✅ Todos os usuários têm dados válidos');
    } else {
      console.log(`❌ ${problemas} problemas encontrados nos dados dos usuários`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API de ranking:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testRankingAPI();
}

module.exports = { testRankingAPI }; 