const { getUsers, updateUser } = require('./database/firebase');

async function fixUserSeries() {
  try {
    console.log('🔧 Corrigindo séries dos usuários...');
    
    // Buscar usuários no Firebase
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📊 Total de usuários: ${usersArray.length}`);
    
    let fixed = 0;
    
    for (const user of usersArray) {
      // Verificar se o usuário tem série undefined ou vazia
      if (!user.serie || user.serie === 'undefined' || user.serie === 'TESTE UNDEFINED') {
        console.log(`🔧 Corrigindo usuário: ${user.login}`);
        
        // Atualizar usuário com série correta
        await updateUser(user.id, {
          serie: 'EQUIPE BASE',
          escola: user.escola || 'FGV MALHADOS INTELECTUAIS'
        });
        
        console.log(`✅ Corrigido: ${user.login} -> EQUIPE BASE`);
        fixed++;
      }
    }
    
    console.log(`\n🎉 Correção concluída!`);
    console.log(`📊 Resumo:`);
    console.log(`  - Usuários corrigidos: ${fixed}`);
    console.log(`  - Total de usuários: ${usersArray.length}`);
    
    if (fixed === 0) {
      console.log(`\n✅ Todos os usuários já têm série correta!`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao corrigir séries:', error);
  }
}

if (require.main === module) {
  fixUserSeries();
}

module.exports = { fixUserSeries }; 