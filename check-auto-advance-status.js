const { getCampanhaConfig } = require('./database/firebase');

async function checkAutoAdvanceStatus() {
  try {
    console.log('🔍 Verificando status do sistema auto-advance...');
    console.log('=' .repeat(50));
    
    // Verificar configuração atual
    const config = await getCampanhaConfig();
    
    if (!config) {
      console.log('❌ Nenhuma campanha configurada encontrada');
      return;
    }
    
    console.log('📋 Configuração atual:');
    console.log(`  - Data início: ${config.data_inicio}`);
    console.log(`  - Duração: ${config.duracao_dias} dias`);
    console.log(`  - Dia atual: ${config.current_day || 'Não definido'}`);
    console.log(`  - Ativa: ${config.ativa}`);
    console.log(`  - Última atualização: ${config.last_updated || 'Nunca'}`);
    
    // Calcular dia esperado
    const dataInicio = new Date(config.data_inicio);
    const dataAtual = new Date();
    const diffTime = dataAtual.getTime() - dataInicio.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const expectedDay = diffDays + 1;
    
    console.log('\n📅 Cálculo manual:');
    console.log(`  - Data início: ${dataInicio.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`  - Data atual: ${dataAtual.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`  - Dias desde início: ${diffDays}`);
    console.log(`  - Dia esperado: ${expectedDay}`);
    console.log(`  - Dia configurado: ${config.current_day || 'Não definido'}`);
    
    // Verificar se está correto
    if (config.current_day === expectedDay) {
      console.log('\n✅ Sistema funcionando corretamente!');
      console.log('   - Dia configurado está correto');
    } else if (!config.current_day) {
      console.log('\n⚠️ Sistema não está atualizando automaticamente');
      console.log('   - current_day não está definido');
      console.log('   - Verifique se o sistema auto-advance está rodando');
    } else {
      console.log('\n❌ Sistema com problema!');
      console.log(`   - Dia configurado: ${config.current_day}`);
      console.log(`   - Dia esperado: ${expectedDay}`);
      console.log('   - Diferença:', Math.abs(config.current_day - expectedDay), 'dias');
    }
    
    // Verificar última atualização
    if (config.last_updated) {
      const lastUpdate = new Date(config.last_updated);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdate.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      console.log('\n⏰ Última atualização:');
      console.log(`  - Timestamp: ${config.last_updated}`);
      console.log(`  - Tempo atrás: ${minutesDiff} minutos`);
      
      if (minutesDiff > 10) {
        console.log('⚠️ Sistema pode não estar rodando (última atualização há mais de 10 minutos)');
      } else {
        console.log('✅ Sistema parece estar ativo');
      }
    } else {
      console.log('\n⚠️ Nunca foi atualizado automaticamente');
    }
    
    console.log('\n💡 Para forçar atualização:');
    console.log('   node force-advance-campaign.js');
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkAutoAdvanceStatus().then(() => {
    console.log('\n✅ Verificação concluída!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
}

module.exports = { checkAutoAdvanceStatus }; 