const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

async function activateCampaign() {
  try {
    console.log('🔧 Ativando campanha...');
    
    // Buscar configuração atual
    const currentConfig = await getCampanhaConfig();
    
    if (!currentConfig) {
      console.log('❌ Nenhuma campanha configurada encontrada');
      return;
    }
    
    console.log('📋 Configuração atual:');
    console.log(`  - Data início: ${currentConfig.data_inicio}`);
    console.log(`  - Duração: ${currentConfig.duracao_dias} dias`);
    console.log(`  - Dia atual: ${currentConfig.current_day || 1}`);
    console.log(`  - Ativa: ${currentConfig.ativa}`);
    
    // Ativar a campanha
    const updatedConfig = {
      ...currentConfig,
      ativa: true,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log('✅ Campanha ativada com sucesso!');
    console.log('🔄 Sistema automático agora deve funcionar corretamente');
    
  } catch (error) {
    console.error('❌ Erro ao ativar campanha:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  activateCampaign().then(() => {
    console.log('✅ Script concluído!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { activateCampaign }; 