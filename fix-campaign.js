const { db } = require('./database/firebase');

async function fixCampaign() {
  try {
    console.log('🔧 Corrigindo data de início da campanha...');
    
    // Definir data de início para ontem para que hoje seja o dia 1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const dataInicio = yesterday.toISOString();
    
    const campanhaConfig = {
      id: 1,
      data_inicio: dataInicio,
      duracao_dias: 4,
              ativa: true,
      created_at: new Date().toISOString()
    };
    
    await db.ref('campanha_config').set(campanhaConfig);
    
    console.log('✅ Data de início corrigida');
    console.log('📅 Data de início:', dataInicio);
    console.log('📅 Hoje será o dia 1 da campanha');
    
    // Testar o cálculo
    const dataInicioDate = new Date(dataInicio);
    const dataAtual = new Date();
    const diffTime = dataAtual.getTime() - dataInicioDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = diffDays + 1;
    console.log('📅 Dia calculado:', currentDay);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

fixCampaign()
  .then(() => {
    console.log('✅ Correção concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro na correção:', error);
    process.exit(1);
  }); 