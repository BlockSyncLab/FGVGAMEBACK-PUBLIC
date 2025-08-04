const { getUsers, updateUser, createUser } = require('./database/firebase');

async function fixUserIds() {
  try {
    console.log('🔧 Corrigindo IDs dos usuários...');
    
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📋 Encontrados ${usersArray.length} usuários`);
    
    let fixed = 0;
    
    for (let i = 0; i < usersArray.length; i++) {
      const user = usersArray[i];
      
      // Se o usuário não tem ID ou tem ID undefined
      if (!user.id || user.id === undefined) {
        // Usar ID numérico sequencial
        const userId = i + 1;
        
        // Criar novo usuário com ID correto
        const newUser = {
          ...user,
          id: userId,
          xp_atual: 0 // Garantir que XP seja 0
        };
        
        // Criar usuário com ID numérico
        await createUser(newUser, userId);
        
        console.log(`✅ Corrigido ID para usuário: ${user.login} -> ${userId}`);
        fixed++;
      }
    }
    
    console.log(`\n🎉 Correção concluída!`);
    console.log(`📊 Resumo:`);
    console.log(`  - Usuários corrigidos: ${fixed}`);
    console.log(`  - Total de usuários: ${usersArray.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir IDs:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixUserIds();
}

module.exports = { fixUserIds }; 