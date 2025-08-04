const { db } = require('./database/firebase');

async function updateCampaign() {
  try {
    console.log('🔄 Atualizando configuração da campanha...');
    
    // Definir data de início para hoje (dia 1)
    const today = new Date();
    // Ajustar para meia-noite para garantir que seja o dia 1
    today.setHours(0, 0, 0, 0);
    const dataInicio = today.toISOString();
    
    const campanhaConfig = {
      id: 1,
      data_inicio: dataInicio,
      duracao_dias: 4,
              ativa: true,
      created_at: new Date().toISOString()
    };
    
    await db.ref('campanha_config').set(campanhaConfig);
    
    console.log('✅ Configuração da campanha atualizada');
    console.log('📅 Data de início:', dataInicio);
    console.log('⏱️ Duração:', campanhaConfig.duracao_dias, 'dias');
    console.log('🎯 Status: Ativa');
    
    // Verificar a configuração atual
    const snapshot = await db.ref('campanha_config').once('value');
    const config = snapshot.val();
    console.log('📋 Configuração atual:', config);
    
    // Testar o cálculo do dia atual
    console.log('🧪 Testando cálculo do dia atual...');
    const dataInicioDate = new Date(config.data_inicio);
    const dataAtual = new Date();
    const diffTime = dataAtual.getTime() - dataInicioDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = diffDays + 1;
    console.log('📅 Dia calculado:', currentDay);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar campanha:', error);
  }
}

if (require.main === module) {
  updateCampaign()
    .then(() => {
      console.log('✅ Atualização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na atualização:', error);
      process.exit(1);
    });
}

module.exports = { updateCampaign }; 