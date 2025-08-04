const fs = require('fs');
const path = require('path');
const { db, testConnection, executeQuery } = require('./database/connection');

async function initializeDatabase() {
  try {
    console.log('🔧 Inicializando banco de dados GA Quiz...');
    
    // Testar conexão
    await testConnection();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Criar tabelas manualmente para garantir
    console.log('📋 Criando tabelas...');
    
    // Criar tabela users
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        turma TEXT NOT NULL,
        escola TEXT NOT NULL,
        xp_atual INTEGER DEFAULT 0,
        erros INTEGER DEFAULT 0,
        id_q1 INTEGER,
        response_q1 BOOLEAN DEFAULT 0,
        id_q2 INTEGER,
        response_q2 BOOLEAN DEFAULT 0,
        id_q3 INTEGER,
        response_q3 BOOLEAN DEFAULT 0,
        id_q4 INTEGER,
        response_q4 BOOLEAN DEFAULT 0,
        id_q5 INTEGER,
        response_q5 BOOLEAN DEFAULT 0,
        -- Novos campos para rastrear respostas
        respostas_incorretas INTEGER DEFAULT 0,
        respostas_atrasadas INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar tabela de configuração da campanha
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS campanha_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_inicio DATE NOT NULL,
        duracao_dias INTEGER NOT NULL,
        ativa BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de logs de segurança
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Criar tabela perguntas
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS perguntas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pergunta TEXT NOT NULL,
        imagem TEXT,
        dica TEXT,
        a1 TEXT NOT NULL,
        a2 TEXT NOT NULL,
        a3 TEXT NOT NULL,
        a4 TEXT NOT NULL,
        a5 TEXT NOT NULL,
        ac INTEGER NOT NULL CHECK (ac >= 1 AND ac <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Verificar se já há dados
    const perguntasCount = await executeQuery('SELECT COUNT(*) as total FROM perguntas');
    const usersCount = await executeQuery('SELECT COUNT(*) as total FROM users');
    const campanhaCount = await executeQuery('SELECT COUNT(*) as total FROM campanha_config');
    
    console.log(`📚 Perguntas existentes: ${perguntasCount[0].total}`);
    console.log(`👥 Usuários existentes: ${usersCount[0].total}`);
    
    // Se não há perguntas, inserir algumas
    if (perguntasCount[0].total === 0) {
      console.log('📝 Inserindo perguntas...');
      
      const perguntas = [
        {
          pergunta: 'No caderno 2 de Matemática, capítulo 5 você aprende sobre frações. Qual das seguintes frações é equivalente a 2/4?',
          dica: 'Frações equivalentes representam a mesma quantidade. Tente simplificar 2/4.',
          a1: '1/2', a2: '1/3', a3: '1/4', a4: '2/3', a5: '3/4', ac: 1
        },
        {
          pergunta: 'Quanto é 15 + 27?',
          dica: 'Some primeiro as unidades, depois as dezenas',
          a1: '40', a2: '42', a3: '41', a4: '43', a5: '39', ac: 2
        },
        {
          pergunta: 'Quanto é 50 - 25?',
          dica: '50 - 25 = 25',
          a1: '23', a2: '24', a3: '25', a4: '26', a5: '27', ac: 3
        },
        {
          pergunta: 'Quanto é 5 x 6?',
          dica: '5 x 6 = 30',
          a1: '28', a2: '29', a3: '30', a4: '31', a5: '32', ac: 3
        },
        {
          pergunta: 'Qual é o resultado de 100 ÷ 4?',
          dica: '100 ÷ 4 = 25',
          a1: '23', a2: '24', a3: '25', a4: '26', a5: '27', ac: 3
        }
      ];
      
      for (const pergunta of perguntas) {
        await executeQuery(`
          INSERT INTO perguntas (pergunta, dica, a1, a2, a3, a4, a5, ac)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          pergunta.pergunta,
          pergunta.dica,
          pergunta.a1,
          pergunta.a2,
          pergunta.a3,
          pergunta.a4,
          pergunta.a5,
          pergunta.ac
        ]);
      }
      
      console.log('✅ Perguntas inseridas com sucesso!');
    }
    
    // Se não há usuários, inserir alguns de exemplo
    if (usersCount[0].total === 0) {
      console.log('👥 Inserindo usuários de exemplo...');
      
      const bcrypt = require('bcrypt');
      const senhaHash = await bcrypt.hash('123456', 10);
      
      const usuarios = [
        {
          login: 'aluno001',
          senha: senhaHash,
          turma: '3ª Série A',
          escola: 'Colégio Estadual da Bahia',
          xp_atual: 490,
          erros: 2,
          id_q1: 1, id_q2: 15, id_q3: 42, id_q4: 73, id_q5: 28
        },
        {
          login: 'aluno002',
          senha: senhaHash,
          turma: '3ª Série A',
          escola: 'Colégio Estadual da Bahia',
          xp_atual: 450,
          erros: 1,
          id_q1: 2, id_q2: 23, id_q3: 67, id_q4: 34, id_q5: 89
        },
        {
          login: 'aluno003',
          senha: senhaHash,
          turma: '3ª Série A',
          escola: 'Colégio Estadual da Bahia',
          xp_atual: 420,
          erros: 3,
          id_q1: 3, id_q2: 45, id_q3: 78, id_q4: 56, id_q5: 19
        }
      ];
      
      for (const usuario of usuarios) {
        await executeQuery(`
          INSERT INTO users (login, senha, turma, escola, xp_atual, erros, id_q1, id_q2, id_q3, id_q4, id_q5)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          usuario.login,
          usuario.senha,
          usuario.turma,
          usuario.escola,
          usuario.xp_atual,
          usuario.erros,
          usuario.id_q1,
          usuario.id_q2,
          usuario.id_q3,
          usuario.id_q4,
          usuario.id_q5
        ]);
      }
      
      console.log('✅ Usuários inseridos com sucesso!');
    }
    
    // Se não há configuração de campanha, criar uma padrão
    if (campanhaCount[0].total === 0) {
      console.log('📅 Criando configuração de campanha padrão...');
      
      // Data de início: hoje
      const hoje = new Date().toISOString().split('T')[0];
      
      await executeQuery(`
        INSERT INTO campanha_config (data_inicio, duracao_dias)
        VALUES (?, 5)
      `, [hoje]);
      
      console.log('✅ Configuração de campanha criada!');
      console.log(`📅 Data de início: ${hoje}`);
      console.log('⏰ Duração: 5 dias');
    }
    
    console.log('🎉 Banco de dados inicializado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Inicialização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na inicialização:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase }; 