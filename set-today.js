const { db } = require('./database/firebase');

async function setToday() {
  try {
    console.log('🎯 Definindo hoje como dia 1 da campanha...');
    
    // Definir data de início para hoje
    const today = new Date();
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
    
    console.log('✅ Configuração atualizada');
    console.log('📅 Data de início:', dataInicio);
    console.log('📅 Hoje será o dia 1 da campanha');
    
    // Testar o cálculo manual
    const dataInicioDate = new Date(dataInicio);
    const dataAtual = new Date();
    console.log('📅 Data de início (objeto):', dataInicioDate);
    console.log('📅 Data atual (objeto):', dataAtual);
    
    const diffTime = dataAtual.getTime() - dataInicioDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = diffDays + 1;
    console.log('📅 Diferença em milissegundos:', diffTime);
    console.log('📅 Diferença em dias:', diffDays);
    console.log('📅 Dia calculado:', currentDay);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

setToday()
  .then(() => {
    console.log('✅ Configuração concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  }); 