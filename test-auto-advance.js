const { autoAdvanceCampaign } = require('./auto-advance-campaign');

async function testAutoAdvance() {
  console.log('🧪 Testando sistema de auto-advance da campanha...');
  console.log('=' .repeat(50));
  
  try {
    await autoAdvanceCampaign();
    console.log('✅ Teste concluído!');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testAutoAdvance(); 