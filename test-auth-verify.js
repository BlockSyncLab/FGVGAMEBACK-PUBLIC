const { getUsers } = require('./database/firebase');

async function testAuthVerify() {
  try {
    console.log('🧪 Testando dados de autenticação...');
    
    // Buscar todos os usuários
    const users = await getUsers();
    
    if (!users || Object.keys(users).length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    
    console.log(`📊 Total de usuários: ${Object.keys(users).length}`);
    
    // Testar com o primeiro usuário
    const firstUserId = Object.keys(users)[0];
    const firstUser = users[firstUserId];
    
    console.log('\n👤 Testando com primeiro usuário:');
    console.log(`  - ID: ${firstUserId}`);
    console.log(`  - Login: ${firstUser.login}`);
    console.log(`  - Nome: ${firstUser.nome}`);
    console.log(`  - Série: ${firstUser.serie}`);
    console.log(`  - Escola: ${firstUser.escola}`);
    console.log(`  - Turma: ${firstUser.turma}`);
    console.log(`  - XP: ${firstUser.xp_atual}`);
    
    // Simular dados que seriam retornados pela rota /verify
    const nivel = Math.floor(firstUser.xp_atual / 50) + 1;
    
    const userData = {
      id: firstUser.id,
      login: firstUser.login,
      nome: firstUser.nome || `Aluno ${firstUser.login}`,
      nivel: nivel,
      xp: firstUser.xp_atual,
      escola: firstUser.escola || 'FGV MALHADOS INTELECTUAIS',
      serie: firstUser.serie || 'EQUIPE BASE',
      turma: firstUser.turma,
      posicaoTurma: 2,
      posicaoSerie: 5,
      posicaoEscola: 8,
      posicaoTurmaGeral: 3,
      posicaoEscolaGeral: 2,
      xp_atual: firstUser.xp_atual,
      erros: firstUser.erros,
      id_q1: firstUser.id_q1,
      response_q1: firstUser.response_q1,
      id_q2: firstUser.id_q2,
      response_q2: firstUser.response_q2,
      id_q3: firstUser.id_q3,
      response_q3: firstUser.response_q3,
      id_q4: firstUser.id_q4,
      response_q4: firstUser.response_q4
    };
    
    console.log('\n📋 Dados que seriam retornados pela rota /verify:');
    console.log(`  - Nome: ${userData.nome}`);
    console.log(`  - Série: ${userData.serie}`);
    console.log(`  - Escola: ${userData.escola}`);
    console.log(`  - Nível: ${userData.nivel}`);
    console.log(`  - XP: ${userData.xp}`);
    
    if (userData.serie === 'EQUIPE BASE') {
      console.log('✅ Série está correta: EQUIPE BASE');
    } else {
      console.log(`❌ Série incorreta: ${userData.serie}`);
    }
    
    if (userData.escola === 'FGV MALHADOS INTELECTUAIS') {
      console.log('✅ Escola está correta: FGV MALHADOS INTELECTUAIS');
    } else {
      console.log(`❌ Escola incorreta: ${userData.escola}`);
    }
    
    console.log('\n💡 Se os dados estão corretos aqui mas não no frontend:');
    console.log('1. Limpe o cache do navegador');
    console.log('2. Faça logout e login novamente');
    console.log('3. Verifique se o token está sendo atualizado');
    
  } catch (error) {
    console.error('❌ Erro ao testar autenticação:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testAuthVerify();
}

module.exports = { testAuthVerify }; 