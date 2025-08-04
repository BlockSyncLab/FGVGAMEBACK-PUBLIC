const bcrypt = require('bcryptjs');
const { executeQuery } = require('./database/connection');

async function updatePasswords() {
  try {
    console.log('🔐 Atualizando senhas dos usuários...');
    
    // Lista de usuários para atualizar
    const users = [
      { login: 'aluno001', senha: '123' },
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

    for (const user of users) {
      // Gerar hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
      
      // Atualizar senha no banco
      await executeQuery(
        'UPDATE users SET senha = ? WHERE login = ?',
        [hashedPassword, user.login]
      );
      
      console.log(`✅ Senha atualizada para ${user.login}`);
    }
    
    console.log('🎉 Todas as senhas foram atualizadas com sucesso!');
    console.log('📝 Login: aluno001-aluno010, Senha: 123');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar senhas:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updatePasswords();
}

module.exports = { updatePasswords }; 