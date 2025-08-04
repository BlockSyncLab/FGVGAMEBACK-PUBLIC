const { db } = require('./database/firebase');

async function testDay1() {
  try {
    console.log('🧪 Testando configuração do dia 1...');
    
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
    
    console.log('✅ Configuração definida para hoje');
    console.log('📅 Data de início:', dataInicio);
    
    // Testar a API
    console.log('🧪 Testando API...');
    const response = await fetch('http://localhost:3001/api/test');
    console.log('✅ Servidor está rodando:', response.status);
    
    // Testar login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: 'aluno001',
        senha: '123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login bem-sucedido');
      
      // Testar busca de questões
      const questionsResponse = await fetch('http://localhost:3001/api/questions/available', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        console.log('✅ Questões carregadas com sucesso');
        console.log('📊 Questões disponíveis:', questionsData.questions.length);
        console.log('📅 Dia atual:', questionsData.currentDay);
        
        if (questionsData.currentDay === 1) {
          console.log('🎉 Sucesso! Hoje é o dia 1 da campanha!');
        } else {
          console.log('❌ Ainda não é dia 1. Dia atual:', questionsData.currentDay);
        }
      } else {
        console.log('❌ Erro ao buscar questões:', questionsResponse.status);
        const errorData = await questionsResponse.json();
        console.log('📝 Erro:', errorData);
      }
    } else {
      console.log('❌ Erro no login:', loginResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testDay1()
  .then(() => {
    console.log('✅ Teste concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }); 