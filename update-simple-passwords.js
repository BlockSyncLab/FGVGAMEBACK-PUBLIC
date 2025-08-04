const { getUsers, updateUser } = require('./database/firebase');

async function updateSimplePasswords() {
  try {
    console.log('🔐 Atualizando senhas como strings simples...');
    
    // Buscar todos os usuários
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    
    console.log(`📋 Encontrados ${usersArray.length} usuários`);
    
    // Lista de usuários para atualizar
    const usersToUpdate = [
      { login: 'aluno001', senha: 'teste123' },
      { login: 'aluno002', senha: '123' },
      { login: 'aluno003', senha: '123' },
      { login: 'aluno004', senha: '123' },
      { login: 'aluno005', senha: '123' },
      { login: 'aluno006', senha: '123' },
      { login: 'aluno007', senha: '123' },
      { login: 'aluno008', senha: '123' },
      { login: 'aluno009', senha: '123' },
      { login: 'aluno010', senha: '123' }
    ];

    for (const userToUpdate of usersToUpdate) {
      // Encontrar usuário no Firebase
      const user = usersArray.find(u => u.login === userToUpdate.login);
      
      if (!user) {
        console.log(`⚠️ Usuário ${userToUpdate.login} não encontrado`);
        continue;
      }
      
      // Atualizar senha como string simples
      await updateUser(user.id, { senha: userToUpdate.senha });
      
      console.log(`✅ Senha atualizada para ${userToUpdate.login}: ${userToUpdate.senha}`);
    }
    
    console.log('🎉 Todas as senhas foram atualizadas com sucesso!');
    console.log('📝 Credenciais:');
    console.log('  - aluno001: teste123');
    console.log('  - aluno002-aluno010: 123');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar senhas:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateSimplePasswords();
}

module.exports = { updateSimplePasswords }; 