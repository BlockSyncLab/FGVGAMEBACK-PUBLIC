const { getUsers, getQuestions, getQuestionById } = require('./database/firebase');

async function testQuestionsAPI() {
  try {
    console.log('🔍 Testando API de questões...');

    // 1. Verificar se há questões no Firebase
    console.log('\n📝 Verificando questões no Firebase...');
    const questions = await getQuestions();
    console.log(`✅ Encontradas ${Object.keys(questions || {}).length} questões no Firebase`);
    
    if (questions) {
      Object.keys(questions).forEach(id => {
        console.log(`  - Questão ${id}: ${questions[id].pergunta}`);
      });
    }

    // 2. Verificar se há usuários no Firebase
    console.log('\n👥 Verificando usuários no Firebase...');
    const users = await getUsers();
    const usersArray = Object.values(users || {});
    console.log(`✅ Encontrados ${usersArray.length} usuários no Firebase`);
    
    if (usersArray.length > 0) {
      const firstUser = usersArray[0];
      console.log('📋 Dados do primeiro usuário:');
      console.log(`  - ID: ${firstUser.id}`);
      console.log(`  - Login: ${firstUser.login}`);
      console.log(`  - Nome: ${firstUser.nome}`);
      console.log(`  - Escola: ${firstUser.escola}`);
      console.log(`  - Série: ${firstUser.serie}`);
      console.log(`  - XP: ${firstUser.xp_atual}`);
      console.log(`  - Questões: ${firstUser.id_q1}, ${firstUser.id_q2}, ${firstUser.id_q3}, ${firstUser.id_q4}`);
    }

    // 3. Testar busca de questão específica
    console.log('\n🔍 Testando busca de questão específica...');
    const question1 = await getQuestionById(1);
    if (question1) {
      console.log('✅ Questão 1 encontrada:');
      console.log(`  - Pergunta: ${question1.pergunta}`);
      console.log(`  - Alternativas: ${question1.a1}, ${question1.a2}, ${question1.a3}, ${question1.a4}, ${question1.a5}`);
      console.log(`  - Resposta correta: ${question1.ac}`);
    } else {
      console.log('❌ Questão 1 não encontrada');
    }

    // 4. Simular chamada da API de questões disponíveis
    console.log('\n🎯 Simulando chamada da API /questions/available...');
    if (usersArray.length > 0) {
      const testUser = usersArray[0];
      console.log(`👤 Usando usuário: ${testUser.login}`);
      
      // Simular lógica da API
      const currentDay = 2; // Forçar dia 2
      console.log(`📅 Dia atual: ${currentDay}`);
      
      const availableQuestions = [];
      
      for (let day = 1; day <= Math.min(currentDay, 4); day++) {
        const questionId = testUser[`id_q${day}`];
        const hasAnswered = testUser[`response_q${day}`];
        
        console.log(`📋 Dia ${day}:`);
        console.log(`  - ID da questão: ${questionId}`);
        console.log(`  - Já respondeu: ${hasAnswered}`);
        
        if (questionId) {
          const question = await getQuestionById(questionId);
          if (question) {
            console.log(`  - Questão encontrada: ${question.pergunta}`);
            availableQuestions.push({
              day: day,
              id: questionId,
              pergunta: question.pergunta,
              hasAnswered: hasAnswered,
              isAvailable: day <= currentDay
            });
          } else {
            console.log(`  - ❌ Questão ${questionId} não encontrada no Firebase`);
          }
        } else {
          console.log(`  - ❌ ID da questão não definido para dia ${day}`);
        }
      }
      
      console.log(`\n📊 Questões disponíveis: ${availableQuestions.filter(q => q.isAvailable && !q.hasAnswered).length}`);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testQuestionsAPI();
}

module.exports = { testQuestionsAPI }; 