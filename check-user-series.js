const { getUsers, updateUser } = require('./database/firebase');

async function checkAndFixUserSeries() {
  try {
    console.log('🔍 Verificando dados da série dos usuários...');
    
    // Buscar todos os usuários
    const users = await getUsers();
    
    if (!users || Object.keys(users).length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    
    console.log(`📊 Total de usuários: ${Object.keys(users).length}`);
    
    let fixedCount = 0;
    let totalCount = 0;
    
    // Verificar cada usuário
    for (const [userId, user] of Object.entries(users)) {
      totalCount++;
      console.log(`\n👤 Usuário ${totalCount}: ${user.login || 'N/A'}`);
      console.log(`  - ID: ${userId}`);
      console.log(`  - Nome: ${user.nome || 'N/A'}`);
      console.log(`  - Série atual: ${user.serie || 'N/A'}`);
      console.log(`  - Escola: ${user.escola || 'N/A'}`);
      console.log(`  - Turma: ${user.turma || 'N/A'}`);
      
      let needsUpdate = false;
      const updates = {};
      
      // Verificar se a série está correta
      if (!user.serie || user.serie === 'undefined' || user.serie.includes('TESTE')) {
        console.log(`  ⚠️ Série incorreta: "${user.serie}" -> Corrigindo para "EQUIPE BASE"`);
        updates.serie = 'EQUIPE BASE';
        needsUpdate = true;
      }
      
      // Verificar se a escola está correta
      if (!user.escola || user.escola === 'undefined' || user.escola.includes('TESTE')) {
        console.log(`  ⚠️ Escola incorreta: "${user.escola}" -> Corrigindo para "FGV MALHADOS INTELECTUAIS"`);
        updates.escola = 'FGV MALHADOS INTELECTUAIS';
        needsUpdate = true;
      }
      
      // Atualizar se necessário
      if (needsUpdate) {
        try {
          await updateUser(userId, updates);
          console.log(`  ✅ Usuário atualizado com sucesso!`);
          fixedCount++;
        } catch (error) {
          console.log(`  ❌ Erro ao atualizar usuário: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Dados já estão corretos`);
      }
    }
    
    console.log(`\n📊 Resumo:`);
    console.log(`  - Total de usuários verificados: ${totalCount}`);
    console.log(`  - Usuários corrigidos: ${fixedCount}`);
    console.log(`  - Usuários já corretos: ${totalCount - fixedCount}`);
    
    if (fixedCount > 0) {
      console.log(`\n✅ Correção concluída! ${fixedCount} usuários foram atualizados.`);
    } else {
      console.log(`\n✅ Todos os usuários já estão com os dados corretos!`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkAndFixUserSeries();
}

module.exports = { checkAndFixUserSeries }; 