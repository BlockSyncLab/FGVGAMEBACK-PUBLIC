const { getUsers } = require('./database/firebase');

async function testSerieFix() {
  try {
    console.log('🔍 Testando correção da série...');
    
    // Buscar usuários no Firebase
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📊 Total de usuários: ${usersArray.length}`);
    
    // Verificar os primeiros 5 usuários
    for (let i = 0; i < Math.min(5, usersArray.length); i++) {
      const user = usersArray[i];
      console.log(`\n👤 Usuário ${i + 1}:`);
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Login: ${user.login}`);
      console.log(`  - Nome: ${user.nome}`);
      console.log(`  - Escola: ${user.escola}`);
      console.log(`  - Série: ${user.serie}`);
      console.log(`  - Turma: ${user.turma}`);
      console.log(`  - XP: ${user.xp_atual}`);
    }
    
    // Simular o que acontece na rota de verificação
    console.log('\n🔧 Simulando rota /verify...');
    const testUser = usersArray[0];
    
    if (testUser) {
      const nivel = Math.floor(testUser.xp_atual / 50) + 1;
      
      const userData = {
        id: testUser.id,
        login: testUser.login,
        nome: testUser.nome || `Aluno ${testUser.login}`,
        nivel: nivel,
        xp: testUser.xp_atual,
        escola: testUser.escola || 'FGV MALHADOS INTELECTUAIS',
        serie: testUser.serie || 'EQUIPE BASE',
        turma: testUser.turma,
        posicaoTurma: 2,
        posicaoSerie: 5,
        posicaoEscola: 8,
        posicaoTurmaGeral: 3,
        posicaoEscolaGeral: 2,
        xp_atual: testUser.xp_atual,
        erros: testUser.erros,
        id_q1: testUser.id_q1,
        response_q1: testUser.response_q1,
        id_q2: testUser.id_q2,
        response_q2: testUser.response_q2,
        id_q3: testUser.id_q3,
        response_q3: testUser.response_q3,
        id_q4: testUser.id_q4,
        response_q4: testUser.response_q4
      };
      
      console.log('\n📋 Dados retornados pela API:');
      console.log(`  - Nome: ${userData.nome}`);
      console.log(`  - Escola: ${userData.escola}`);
      console.log(`  - Série: ${userData.serie}`);
      console.log(`  - Turma: ${userData.turma}`);
      console.log(`  - XP: ${userData.xp}`);
      console.log(`  - Nível: ${userData.nivel}`);
    }
    
    console.log('\n✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

if (require.main === module) {
  testSerieFix();
}

module.exports = { testSerieFix }; 