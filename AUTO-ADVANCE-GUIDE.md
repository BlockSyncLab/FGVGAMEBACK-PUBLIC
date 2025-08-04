# Guia do Sistema de Auto-Advance da Campanha

## 🎯 Objetivo
O sistema de auto-advance garante que o dia da campanha seja sempre calculado corretamente baseado na data real, independente de quando o servidor foi iniciado ou reiniciado.

## ⚙️ Como Funciona

### 1. Cálculo Baseado na Data Real
- O sistema **sempre** calcula o dia atual baseado na data de início da campanha
- **Fórmula:** `Dia Atual = (Data Atual - Data Início) + 1`
- Usa o fuso horário de Brasília (`America/Sao_Paulo`) para todos os cálculos
- **Não incrementa** o dia, sempre recalcula baseado na data real

### 2. Verificação Automática
- O sistema verifica a cada **5 minutos** se o dia está correto
- Sempre recalcula baseado na data real e atualiza o `current_day`
- Garante que o dia nunca fique desatualizado

### 3. Exemplos de Cálculo
```
Data Início: 31/07/2025
Data Atual: 31/07/2025 → Dia 1
Data Atual: 01/08/2025 → Dia 2  
Data Atual: 02/08/2025 → Dia 3
Data Atual: 03/08/2025 → Dia 4
```

## 🛠️ Scripts Disponíveis

### 1. Verificar Status da Campanha
```bash
node check-campaign-status.js
```
**O que faz:**
- Mostra a configuração atual da campanha
- Calcula se o dia precisa ser atualizado
- Exibe informações detalhadas sobre datas e progresso

### 2. Ativar Campanha
```bash
node activate-campaign.js
```
**O que faz:**
- Define `ativa: true` na configuração da campanha
- Necessário para o sistema automático funcionar
- Execute este script se a campanha não estiver ativa

### 3. Testar Sistema de Auto-Advance
```bash
node test-auto-advance.js
```
**O que faz:**
- Executa uma verificação manual do sistema
- Mostra logs detalhados do processo
- Útil para debug

### 4. Forçar Avanço Manual
```bash
node force-advance-campaign.js
```
**O que faz:**
- Avança manualmente para o próximo dia
- Útil quando o sistema automático falha
- Não verifica se é meia-noite

### 5. Iniciar Sistema Automático
```bash
node auto-advance-campaign.js start
```
**O que faz:**
- Inicia o sistema de verificação contínua
- Verifica a cada 5 minutos
- Recalcula o dia baseado na data real

## 🔧 Configuração

### Variáveis de Ambiente
Certifique-se de que o servidor está configurado com:
- `TZ=America/Sao_Paulo` (opcional, mas recomendado)

### Firebase
O sistema usa o Firebase para armazenar a configuração da campanha:
- `campanha_config` - Configuração geral da campanha
- `current_day` - Dia atual da campanha (sempre calculado baseado na data real)
- `ativa` - Status da campanha (true/false/undefined)
- `last_updated` - Última atualização

## 🚨 Troubleshooting

### Problema: Campanha não avança automaticamente

1. **Verificar se a campanha está ativa:**
   ```bash
   node check-campaign-status.js
   # Se "Ativa: undefined" ou "Ativa: false", execute:
   node activate-campaign.js
   ```

2. **Verificar logs do servidor:**
   ```bash
   # No servidor, procure por logs como:
   🕛 Verificando dia atual da campanha...
   🌍 Hora atual em Brasília: ...
   # Verificações a cada 5 minutos
   ```

3. **Verificar status atual:**
   ```bash
   node check-campaign-status.js
   ```

4. **Forçar avanço manual:**
   ```bash
   node force-advance-campaign.js
   ```

5. **Verificar configuração da campanha:**
   - Data de início está correta?
   - Campanha está ativa?
   - Duração está configurada?

### Problema: Fuso horário incorreto

1. **Verificar horário do servidor:**
   ```bash
   date
   ```

2. **Configurar timezone (Linux):**
   ```bash
   sudo timedatectl set-timezone America/Sao_Paulo
   ```

3. **Configurar timezone (Docker):**
   ```dockerfile
   ENV TZ=America/Sao_Paulo
   ```

## 📊 Logs Importantes

### Logs de Sucesso
```
🕛 [AUTO-ADVANCE] Verificando dia atual da campanha...
🌍 [AUTO-ADVANCE] Hora atual em Brasília: 12:30:00
📅 [AUTO-ADVANCE] Dia calculado: 2
🔄 [AUTO-ADVANCE] Atualizando dia de 1 para 2
✅ [AUTO-ADVANCE] Dia atualizado!
```

### Logs de Erro
```
❌ [AUTO-ADVANCE] Erro ao verificar dia atual: [erro]
⚠️ [AUTO-ADVANCE] Campanha não está ativa
⏳ [AUTO-ADVANCE] Campanha ainda não começou
```

## 🔄 Integração com o Servidor

O sistema é iniciado automaticamente quando o servidor inicia:
```javascript
// Em server.js
const { startAutoAdvanceCampaign } = require('./auto-advance-campaign');
startAutoAdvanceCampaign();
```

## 📝 Notas Importantes

1. **Fuso Horário:** Sempre usa horário de Brasília
2. **Verificação:** A cada 5 minutos (mais frequente que antes)
3. **Cálculo:** Sempre baseado na data real, nunca incrementa
4. **Campanha Ativa:** Deve estar ativa para funcionar
5. **Logs:** Mantém logs detalhados para debug
6. **Fallback:** Scripts manuais disponíveis para emergências
7. **Confiabilidade:** Nunca fica desatualizado, sempre recalcula

## 🆘 Comandos de Emergência

Se o sistema automático falhar:

1. **Ativar campanha:**
   ```bash
   node activate-campaign.js
   ```

2. **Verificar status:**
   ```bash
   node check-campaign-status.js
   ```

3. **Forçar avanço:**
   ```bash
   node force-advance-campaign.js
   ```

4. **Reiniciar servidor:**
   ```bash
   # Reiniciar o servidor para recarregar o sistema automático
   npm start
   ```

## 🎯 Checklist para Funcionamento Automático

- [ ] Campanha configurada com data de início
- [ ] Campanha marcada como ativa (`ativa: true`)
- [ ] Servidor rodando continuamente
- [ ] Sistema automático iniciado no servidor
- [ ] Fuso horário configurado para Brasília
- [ ] Logs mostrando verificação a cada 5 minutos
- [ ] Cálculo baseado na data real funcionando

## 🔍 Vantagens da Nova Abordagem

1. **Confiabilidade:** Nunca fica desatualizado
2. **Simplicidade:** Sempre calcula baseado na data real
3. **Robustez:** Funciona mesmo se o servidor for reiniciado
4. **Precisão:** Sempre correto, independente de falhas anteriores
5. **Debug:** Fácil de entender e debugar 