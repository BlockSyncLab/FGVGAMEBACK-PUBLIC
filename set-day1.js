const { db } = require('./database/firebase');

async function setDay1() {
  try {
    console.log('🎯 Definindo hoje como dia 1 da campanha...');
    
    // Definir data de início para 2 dias atrás para garantir que hoje seja dia 1
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);
    const dataInicio = twoDaysAgo.toISOString();
    
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
    
    // Testar o cálculo
    const dataInicioDate = new Date(dataInicio);
    const dataAtual = new Date();
    const diffTime = dataAtual.getTime() - dataInicioDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = diffDays + 1;
    console.log('📅 Dia calculado:', currentDay);
    
    if (currentDay === 1) {
      console.log('✅ Sucesso! Hoje é o dia 1');
    } else {
      console.log('❌ Ainda não é dia 1. Tentando novamente...');
      // Tentar com 3 dias atrás
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      threeDaysAgo.setHours(0, 0, 0, 0);
      const dataInicio2 = threeDaysAgo.toISOString();
      
      campanhaConfig.data_inicio = dataInicio2;
      await db.ref('campanha_config').set(campanhaConfig);
      
      console.log('📅 Nova data de início:', dataInicio2);
      
      const dataInicioDate2 = new Date(dataInicio2);
      const diffTime2 = dataAtual.getTime() - dataInicioDate2.getTime();
      const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
      const currentDay2 = diffDays2 + 1;
      console.log('📅 Novo dia calculado:', currentDay2);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

setDay1()
  .then(() => {
    console.log('✅ Configuração concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  }); 