const { getUsers, createUser } = require('./database/firebase');

async function recreateUsersWithIds() {
  try {
    console.log('🔄 Recriando usuários com IDs numéricos...');
    
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📋 Encontrados ${usersArray.length} usuários`);
    
    let recreated = 0;
    
    for (let i = 0; i < usersArray.length; i++) {
      const user = usersArray[i];
      const userId = i + 1;
      
      // Criar novo usuário com ID numérico correto
      const newUser = {
        id: userId,
        login: user.login,
        nome: user.nome,
        turma: user.turma,
        senha: user.senha,
        escola: user.escola || 'FGV MALHADOS INTELECTUAIS',
        serie: user.serie || 'EQUIPE BASE',
        xp_atual: 0, // Garantir que XP seja 0
        erros: user.erros || 0,
        id_q1: user.id_q1,
        response_q1: user.response_q1 || false,
        id_q2: user.id_q2,
        response_q2: user.response_q2 || false,
        id_q3: user.id_q3,
        response_q3: user.response_q3 || false,
        id_q4: user.id_q4,
        response_q4: user.response_q4 || false
      };
      
      // Criar usuário com ID numérico
      await createUser(newUser, userId);
      
      console.log(`✅ Recriado usuário: ${user.login} -> ID ${userId}`);
      recreated++;
    }
    
    console.log(`\n🎉 Recriação concluída!`);
    console.log(`📊 Resumo:`);
    console.log(`  - Usuários recriados: ${recreated}`);
    console.log(`  - Total de usuários: ${usersArray.length}`);
    console.log(`\n💡 Agora todos os usuários têm IDs numéricos (1, 2, 3, ...)`);
    
  } catch (error) {
    console.error('❌ Erro ao recriar usuários:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  recreateUsersWithIds();
}

module.exports = { recreateUsersWithIds }; 