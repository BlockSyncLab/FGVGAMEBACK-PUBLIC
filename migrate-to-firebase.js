const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { 
  testConnection, 
  getUsers, 
  createUser, 
  updateUser,
  getQuestions,
  getCampanhaConfig,
  updateCampanhaConfig,
  db 
} = require('./database/firebase');

// Conexão com SQLite
const sqlitePath = path.join(__dirname, 'database', 'ga_quiz.db');
const sqliteDb = new sqlite3.Database(sqlitePath);

// Função para executar query no SQLite
const executeSqliteQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Migrar usuários
const migrateUsers = async () => {
  console.log('🔄 Migrando usuários...');
  
  try {
    const users = await executeSqliteQuery('SELECT * FROM users');
    console.log(`📊 Encontrados ${users.length} usuários`);
    
    for (const user of users) {
      // Converter dados do SQLite para formato Firebase
      const userData = {
        id: user.id,
        login: user.login,
        senha: user.senha,
        turma: user.turma,
        escola: user.escola,
        xp_atual: user.xp_atual || 0,
        erros: user.erros || 0,
        id_q1: user.id_q1,
        id_q2: user.id_q2,
        id_q3: user.id_q3,
        id_q4: user.id_q4,
        response_q1: user.response_q1 || false,
        response_q2: user.response_q2 || false,
        response_q3: user.response_q3 || false,
        response_q4: user.response_q4 || false,
        respostas_incorretas: user.respostas_incorretas || 0,
        respostas_atrasadas: user.respostas_atrasadas || 0,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString()
      };
      
      // Salvar no Firebase usando o ID original
      await db.ref(`users/${user.id}`).set(userData);
      console.log(`✅ Usuário ${user.login} migrado`);
    }
    
    console.log('✅ Migração de usuários concluída');
  } catch (error) {
    console.error('❌ Erro ao migrar usuários:', error);
    throw error;
  }
};

// Migrar perguntas
const migrateQuestions = async () => {
  console.log('🔄 Migrando perguntas...');
  
  try {
    const questions = await executeSqliteQuery('SELECT * FROM perguntas');
    console.log(`📊 Encontradas ${questions.length} perguntas`);
    
    for (const question of questions) {
      const questionData = {
        id: question.id,
        pergunta: question.pergunta,
        imagem: question.imagem,
        dica: question.dica,
        a1: question.a1,
        a2: question.a2,
        a3: question.a3,
        a4: question.a4,
        a5: question.a5,
        ac: question.ac
      };
      
      await db.ref(`perguntas/${question.id}`).set(questionData);
      console.log(`✅ Pergunta ${question.id} migrada`);
    }
    
    console.log('✅ Migração de perguntas concluída');
  } catch (error) {
    console.error('❌ Erro ao migrar perguntas:', error);
    throw error;
  }
};

// Migrar configuração da campanha
const migrateCampanhaConfig = async () => {
  console.log('🔄 Migrando configuração da campanha...');
  
  try {
    const config = await executeSqliteQuery('SELECT * FROM campanha_config LIMIT 1');
    
    if (config.length > 0) {
      const campanhaData = {
        id: config[0].id,
        data_inicio: config[0].data_inicio,
        duracao_dias: config[0].duracao_dias,
        ativa: config[0].ativa || true,
        created_at: config[0].created_at || new Date().toISOString()
      };
      
      await db.ref('campanha_config').set(campanhaData);
      console.log('✅ Configuração da campanha migrada');
    } else {
      // Criar configuração padrão se não existir
      const defaultConfig = {
        id: 1,
        data_inicio: new Date().toISOString().split('T')[0], // Data atual
        duracao_dias: 4,
        ativa: true,
        created_at: new Date().toISOString()
      };
      
      await db.ref('campanha_config').set(defaultConfig);
      console.log('✅ Configuração padrão da campanha criada');
    }
  } catch (error) {
    console.error('❌ Erro ao migrar configuração da campanha:', error);
    throw error;
  }
};

// Função principal de migração
const migrateToFirebase = async () => {
  console.log('🚀 Iniciando migração para Firebase Realtime Database...');
  
  try {
    // Testar conexão com Firebase
    await testConnection();
    
    // Migrar dados
    await migrateUsers();
    await migrateQuestions();
    await migrateCampanhaConfig();
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log('📊 Dados migrados:');
    console.log('   - Usuários');
    console.log('   - Perguntas');
    console.log('   - Configuração da campanha');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    process.exit(0);
  }
};

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateToFirebase();
}

module.exports = { migrateToFirebase }; 