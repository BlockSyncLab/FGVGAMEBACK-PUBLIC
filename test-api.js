async function testAPI() {
  try {
    console.log('🧪 Testando API...');
    
    // Teste 1: Verificar se o servidor está rodando
    console.log('📡 Testando se o servidor está rodando...');
    const response = await fetch('http://localhost:3001/api/test');
    console.log('✅ Servidor está rodando:', response.status);
    
    // Teste 2: Testar login
    console.log('🔐 Testando login...');
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
      console.log('👤 Usuário:', loginData.user.login);
      console.log('🔑 Token:', loginData.token ? 'Presente' : 'Ausente');
      
      // Teste 3: Testar busca de questões com token
      console.log('❓ Testando busca de questões...');
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
      } else {
        console.log('❌ Erro ao buscar questões:', questionsResponse.status);
        const errorData = await questionsResponse.json();
        console.log('📝 Erro:', errorData);
      }
    } else {
      console.log('❌ Erro no login:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('📝 Erro:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAPI(); 