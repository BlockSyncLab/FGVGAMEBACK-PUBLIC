const { executeQuery } = require('./database/connection');

async function updateDatabase() {
  try {
    console.log('🔧 Atualizando banco de dados...');
    
    // Adicionar novos campos à tabela users
    console.log('📝 Adicionando novos campos à tabela users...');
    
    await executeQuery('ALTER TABLE users ADD COLUMN respostas_incorretas INTEGER DEFAULT 0');
    console.log('✅ Campo respostas_incorretas adicionado');
    
    await executeQuery('ALTER TABLE users ADD COLUMN respostas_atrasadas INTEGER DEFAULT 0');
    console.log('✅ Campo respostas_atrasadas adicionado');
    
    // Verificar se os campos foram adicionados
    const columns = await executeQuery("SELECT name FROM pragma_table_info('users') WHERE name IN ('respostas_incorretas', 'respostas_atrasadas')");
    console.log('📋 Campos adicionados:', columns.map(col => col.name));
    
    console.log('🎉 Banco de dados atualizado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar banco de dados:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateDatabase()
    .then(() => {
      console.log('✅ Atualização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na atualização:', error);
      process.exit(1);
    });
}

module.exports = { updateDatabase }; 