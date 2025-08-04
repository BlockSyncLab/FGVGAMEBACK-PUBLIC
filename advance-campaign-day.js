const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

async function advanceCampaignDay() {
  try {
    console.log('📅 Avançando dia da campanha...');
    
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
    
    // Calcular próximo dia
    const currentDay = currentConfig.current_day || 1;
    const nextDay = currentDay + 1;
    
    // Verificar se não ultrapassou a duração
    if (nextDay > currentConfig.duracao_dias) {
      console.log(`⚠️ Campanha já está no último dia (${currentDay}/${currentConfig.duracao_dias})`);
      console.log('💡 Para reiniciar a campanha, execute: node reset-campaign.js');
      return;
    }
    
    // Atualizar configuração
    const updatedConfig = {
      ...currentConfig,
      current_day: nextDay,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log(`✅ Dia avançado com sucesso!`);
    console.log(`📊 Novo dia: ${nextDay}/${currentConfig.duracao_dias}`);
    
    // Mostrar desafios disponíveis
    console.log('\n🎯 Desafios disponíveis:');
    for (let day = 1; day <= nextDay; day++) {
      console.log(`  - Dia ${day}: Disponível`);
    }
    
    console.log('\n💡 Próximos passos:');
    console.log('1. Os usuários agora podem acessar os desafios do dia ' + nextDay);
    console.log('2. Para avançar novamente: execute node advance-campaign-day.js');
    console.log('3. Para verificar status: execute node check-campaign-status.js');
    
  } catch (error) {
    console.error('❌ Erro ao avançar dia:', error);
  }
}

// Função para definir um dia específico
async function setCampaignDay(day) {
  try {
    console.log(`📅 Definindo dia da campanha para: ${day}`);
    
    const currentConfig = await getCampanhaConfig();
    
    if (!currentConfig) {
      console.log('❌ Nenhuma campanha configurada encontrada');
      return;
    }
    
    // Validar dia
    if (day < 1 || day > currentConfig.duracao_dias) {
      console.log(`❌ Dia inválido. Deve ser entre 1 e ${currentConfig.duracao_dias}`);
      return;
    }
    
    // Atualizar configuração
    const updatedConfig = {
      ...currentConfig,
      current_day: day,
      last_updated: new Date().toISOString()
    };
    
    await updateCampanhaConfig(updatedConfig);
    
    console.log(`✅ Dia definido com sucesso!`);
    console.log(`📊 Dia atual: ${day}/${currentConfig.duracao_dias}`);
    
  } catch (error) {
    console.error('❌ Erro ao definir dia:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const day = process.argv[2];
  
  if (day) {
    setCampaignDay(parseInt(day));
  } else {
    advanceCampaignDay();
  }
}

module.exports = { advanceCampaignDay, setCampaignDay }; 