const { getCampanhaConfig } = require('./database/firebase');

async function checkCampaignStatus() {
  try {
    console.log('📊 Verificando status da campanha...');
    console.log('=' .repeat(50));
    
    // Buscar configuração atual
    const currentConfig = await getCampanhaConfig();
    
    if (!currentConfig) {
      console.log('❌ Nenhuma campanha configurada encontrada');
      return;
    }
    
    console.log('📋 Configuração da campanha:');
    console.log(`  - Data início: ${currentConfig.data_inicio}`);
    console.log(`  - Duração: ${currentConfig.duracao_dias} dias`);
    console.log(`  - Dia atual: ${currentConfig.current_day || 1}`);
    console.log(`  - Ativa: ${currentConfig.ativa}`);
    console.log(`  - Última atualização: ${currentConfig.last_updated || 'Nunca'}`);
    
    // Calcular informações adicionais
    const dataInicio = new Date(currentConfig.data_inicio);
    const dataAtual = new Date();
    const diffTime = dataAtual.getTime() - dataInicio.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const calculatedDay = diffDays + 1;
    
    console.log('\n📅 Informações de data:');
    console.log(`  - Data início: ${dataInicio.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`  - Data atual: ${dataAtual.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`  - Dias desde início: ${diffDays}`);
    console.log(`  - Dia calculado: ${calculatedDay}`);
    console.log(`  - Dia configurado: ${currentConfig.current_day || 1}`);
    
    // Verificar se precisa avançar
    if (calculatedDay > (currentConfig.current_day || 1)) {
      console.log('\n⚠️ ATENÇÃO: O dia da campanha precisa ser atualizado!');
      console.log(`   - Dia atual: ${currentConfig.current_day || 1}`);
      console.log(`   - Dia correto: ${calculatedDay}`);
    } else {
      console.log('\n✅ Dia da campanha está correto!');
    }
    
    // Verificar status da campanha
    if (diffDays < 0) {
      console.log('\n⏳ Campanha ainda não começou');
    } else if (diffDays >= currentConfig.duracao_dias) {
      console.log('\n🏁 Campanha já terminou');
    } else {
      console.log('\n🎯 Campanha em andamento');
      console.log(`   - Progresso: ${currentConfig.current_day || 1}/${currentConfig.duracao_dias} dias`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkCampaignStatus().then(() => {
    console.log('\n✅ Verificação concluída!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { checkCampaignStatus }; 