const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

async function updateCampaignStructure() {
  try {
    console.log('🔧 Atualizando estrutura da campanha...');
    
    // Buscar configuração atual
    const currentConfig = await getCampanhaConfig();
    
    console.log('📋 Configuração atual:');
    console.log(currentConfig);
    
    // Calcular current_day baseado na data de início
    let currentDay = 1;
    
    if (currentConfig && currentConfig.data_inicio) {
      const dataInicio = new Date(currentConfig.data_inicio);
      const dataAtual = new Date();
      
      // Calcular diferença em dias
      const diffTime = dataAtual.getTime() - dataInicio.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Se ainda não começou a campanha
      if (diffDays < 0) {
        currentDay = 0;
      }
      // Se a campanha já terminou
      else if (diffDays >= currentConfig.duracao_dias) {
        currentDay = currentConfig.duracao_dias;
      }
      // Dia atual da campanha (1-based)
      else {
        currentDay = diffDays + 1;
      }
    }
    
    console.log(`📅 Calculado current_day: ${currentDay}`);
    
    // Atualizar configuração com current_day
    const updatedConfig = {
      ...currentConfig,
      current_day: currentDay,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log('✅ Configuração atualizada com sucesso!');
    console.log('📊 Nova configuração:');
    console.log(updatedConfig);
    
    console.log('\n💡 Como usar:');
    console.log('1. O backend agora usa current_day para determinar desafios disponíveis');
    console.log('2. Para avançar o dia: execute node advance-campaign-day.js');
    console.log('3. Para verificar status: execute node check-campaign-status.js');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar estrutura:', error);
  }
}

if (require.main === module) {
  updateCampaignStructure();
}

module.exports = { updateCampaignStructure }; 