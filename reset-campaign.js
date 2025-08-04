const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

async function resetCampaign() {
  try {
    console.log('🔄 Reiniciando campanha...');
    
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
    
    // Confirmar reinicialização
    console.log('\n⚠️ ATENÇÃO:');
    console.log('  - A campanha será reiniciada para o dia 1');
    console.log('  - Todos os usuários voltarão ao início');
    console.log('  - As respostas anteriores serão mantidas');
    console.log('  - Apenas o current_day será resetado');
    
    // Atualizar configuração
    const updatedConfig = {
      ...currentConfig,
      current_day: 1,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log('\n✅ Campanha reiniciada com sucesso!');
    console.log(`📊 Novo dia: 1/${currentConfig.duracao_dias}`);
    
    console.log('\n💡 Próximos passos:');
    console.log('1. A campanha agora está no dia 1');
    console.log('2. Para avançar: execute node advance-campaign-day.js');
    console.log('3. Para verificar status: execute node check-campaign-status.js');
    
  } catch (error) {
    console.error('❌ Erro ao reiniciar campanha:', error);
  }
}

// Função para configurar uma nova campanha
async function setupNewCampaign(duration = 4) {
  try {
    console.log(`🎯 Configurando nova campanha com ${duration} dias...`);
    
    const today = new Date();
    const newConfig = {
      data_inicio: today.toISOString(),
      duracao_dias: duration,
      current_day: 1,
      ativa: true,
      last_updated: today.toISOString()
    };
    
    await updateCampanhaConfig(newConfig);
    
    console.log('✅ Nova campanha configurada com sucesso!');
    console.log('📊 Configuração:');
    console.log(`  - Data início: ${newConfig.data_inicio}`);
    console.log(`  - Duração: ${newConfig.duracao_dias} dias`);
    console.log(`  - Dia atual: ${newConfig.current_day}`);
    console.log(`  - Ativa: ${newConfig.ativa}`);
    
  } catch (error) {
    console.error('❌ Erro ao configurar nova campanha:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const command = process.argv[2];
  const duration = process.argv[3];
  
  if (command === 'new' && duration) {
    setupNewCampaign(parseInt(duration));
  } else if (command === 'new') {
    setupNewCampaign();
  } else {
    resetCampaign();
  }
}

module.exports = { resetCampaign, setupNewCampaign }; 