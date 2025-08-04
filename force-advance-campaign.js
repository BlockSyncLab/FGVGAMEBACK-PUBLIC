const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

async function forceAdvanceCampaign() {
  try {
    console.log('🔧 Forçando avanço da campanha...');
    
    // Buscar configuração atual
    const currentConfig = await getCampanhaConfig();
    
    if (!currentConfig) {
      console.log('❌ Nenhuma campanha configurada encontrada');
      return;
    }
    
    console.log('📋 Configuração atual:');
    console.log(`  - Dia atual: ${currentConfig.current_day || 1}`);
    console.log(`  - Duração: ${currentConfig.duracao_dias} dias`);
    
    // Calcular próximo dia
    const nextDay = (currentConfig.current_day || 1) + 1;
    
    if (nextDay > currentConfig.duracao_dias) {
      console.log('⚠️ Campanha já terminou!');
      return;
    }
    
    console.log(`🔄 Avançando para o dia ${nextDay}...`);
    
    // Atualizar configuração
    const updatedConfig = {
      ...currentConfig,
      current_day: nextDay,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log(`✅ Campanha avançada para o dia ${nextDay}!`);
    console.log(`📊 Progresso: ${nextDay}/${currentConfig.duracao_dias}`);
    
  } catch (error) {
    console.error('❌ Erro ao forçar avanço:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  forceAdvanceCampaign().then(() => {
    console.log('✅ Script concluído!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { forceAdvanceCampaign }; 