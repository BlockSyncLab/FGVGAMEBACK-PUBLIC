const { getCampanhaConfig, updateCampanhaConfig } = require('./database/firebase');

// Função para obter data atual no fuso horário de Brasília
function getBrasiliaTime() {
  const now = new Date();
  const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
  return brasiliaTime;
}

// Função para calcular o dia atual baseado na data real
function calculateCurrentDay(dataInicio, duracaoDias) {
  const brasiliaTime = getBrasiliaTime();
  const dataInicioDate = new Date(dataInicio);
  
  // Calcular diferença em dias
  const diffTime = brasiliaTime.getTime() - dataInicioDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Se ainda não começou a campanha
  if (diffDays < 0) {
    return 0;
  }
  
  // Se a campanha já terminou
  if (diffDays >= duracaoDias) {
    return duracaoDias;
  }
  
  // Dia atual da campanha (1-based)
  return diffDays + 1;
}

async function autoAdvanceCampaign() {
  try {
    console.log('🕛 [AUTO-ADVANCE] Verificando dia atual da campanha...');
    
    // Obter hora atual em Brasília
    const brasiliaTime = getBrasiliaTime();
    console.log(`🌍 [AUTO-ADVANCE] Hora atual em Brasília: ${brasiliaTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    
    // Buscar configuração atual
    const currentConfig = await getCampanhaConfig();
    
    if (!currentConfig) {
      console.log('❌ [AUTO-ADVANCE] Nenhuma campanha configurada encontrada');
      return;
    }
    
    console.log('📋 [AUTO-ADVANCE] Configuração atual:');
    console.log(`  - Data início: ${currentConfig.data_inicio}`);
    console.log(`  - Duração: ${currentConfig.duracao_dias} dias`);
    console.log(`  - Dia atual: ${currentConfig.current_day || 'Não definido'}`);
    console.log(`  - Ativa: ${currentConfig.ativa}`);
    
    // Verificar se a campanha está ativa (se não estiver definida, considerar como ativa)
    const isActive = currentConfig.ativa !== false; // Se undefined ou true, considerar ativa
    if (!isActive) {
      console.log('⚠️ [AUTO-ADVANCE] Campanha não está ativa');
      return;
    }
    
    // Calcular dia atual baseado na data real
    const calculatedDay = calculateCurrentDay(currentConfig.data_inicio, currentConfig.duracao_dias);
    const currentDay = currentConfig.current_day || 0;
    
    console.log(`📅 [AUTO-ADVANCE] Data início: ${new Date(currentConfig.data_inicio).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`📅 [AUTO-ADVANCE] Data atual: ${brasiliaTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    console.log(`📅 [AUTO-ADVANCE] Dia calculado: ${calculatedDay}`);
    console.log(`📅 [AUTO-ADVANCE] Dia atual na config: ${currentDay}`);
    
    // Sempre atualizar para o dia calculado (mais confiável)
    if (calculatedDay !== currentDay) {
      console.log(`🔄 [AUTO-ADVANCE] Atualizando dia de ${currentDay} para ${calculatedDay}`);
      
      // Atualizar configuração
      const updatedConfig = {
        ...currentConfig,
        current_day: calculatedDay,
        last_updated: brasiliaTime.toISOString()
      };
      
      await updateCampanhaConfig(updatedConfig);
      
      console.log(`✅ [AUTO-ADVANCE] Dia atualizado!`);
      console.log(`📊 [AUTO-ADVANCE] Novo dia: ${calculatedDay}/${currentConfig.duracao_dias}`);
      
      // Mostrar status da campanha
      if (calculatedDay === 0) {
        console.log('⏳ [AUTO-ADVANCE] Campanha ainda não começou');
      } else if (calculatedDay > currentConfig.duracao_dias) {
        console.log('🏁 [AUTO-ADVANCE] Campanha já terminou');
      } else {
        console.log('🎯 [AUTO-ADVANCE] Campanha em andamento');
        console.log('\n🎯 [AUTO-ADVANCE] Desafios disponíveis:');
        for (let day = 1; day <= calculatedDay; day++) {
          console.log(`  - Dia ${day}: Disponível`);
        }
      }
      
    } else {
      console.log('✅ [AUTO-ADVANCE] Dia já está correto');
    }
    
  } catch (error) {
    console.error('❌ [AUTO-ADVANCE] Erro ao verificar dia atual:', error);
  }
}

// Função para executar verificação periódica
async function startAutoAdvance() {
  console.log('🤖 [AUTO-ADVANCE] Iniciando verificação automática do dia da campanha...');
  console.log('⏰ [AUTO-ADVANCE] Verificando a cada 5 minutos no horário de Brasília...');
  
  // Verificar imediatamente
  await autoAdvanceCampaign();
  
  // Verificar a cada 5 minutos
  setInterval(async () => {
    const brasiliaTime = getBrasiliaTime();
    console.log(`🕐 [AUTO-ADVANCE] Verificação automática: ${brasiliaTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    
    // Sempre verificar e atualizar o dia
    await autoAdvanceCampaign();
    
  }, 5 * 60 * 1000); // Verificar a cada 5 minutos
}

// Função para iniciar o sistema automático (exportada para o servidor)
function startAutoAdvanceCampaign() {
  startAutoAdvance();
}

// Executar se chamado diretamente
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'start') {
    startAutoAdvance();
  } else {
    autoAdvanceCampaign();
  }
}

module.exports = { autoAdvanceCampaign, startAutoAdvance, startAutoAdvanceCampaign, calculateCurrentDay }; 