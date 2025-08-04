# 🎯 Guia de Gerenciamento de Campanhas - EDURATS

## 📋 **Nova Arquitetura**

### **Estrutura da Campanha:**
```javascript
{
  data_inicio: "2024-01-15T00:00:00.000Z",
  duracao_dias: 4,
  current_day: 2,           // ← NOVO: Controla o dia atual
  ativa: true,
  last_updated: "2024-01-16T10:30:00.000Z"
}
```

### **Como Funciona:**
- ✅ **`current_day`** controla qual dia da campanha está ativo
- ✅ **Backend** usa `current_day` para determinar desafios disponíveis
- ✅ **Frontend** exibe "DIA XX de YY" baseado em `current_day` e `duracao_dias`
- ✅ **Usuários** só veem desafios do dia atual e anteriores

## 🚀 **Scripts de Gerenciamento**

### 1. **Atualizar Estrutura da Campanha**
```bash
node update-campaign-structure.js
```
- ✅ Adiciona `current_day` à configuração existente
- ✅ Calcula o dia atual baseado na data de início
- ✅ Mantém configuração existente

### 2. **Verificar Status da Campanha**
```bash
node check-campaign-status.js
```
- ✅ Mostra configuração atual
- ✅ Exibe progresso da campanha
- ✅ Lista desafios por dia
- ✅ Verifica questões disponíveis

### 3. **Avançar Dia da Campanha**
```bash
# Avançar para o próximo dia
node advance-campaign-day.js

# Definir dia específico
node advance-campaign-day.js 3
```
- ✅ Avança automaticamente para o próximo dia
- ✅ Permite definir um dia específico
- ✅ Valida se não ultrapassa a duração

### 4. **Reiniciar Campanha**
```bash
# Reiniciar para dia 1
node reset-campaign.js

# Criar nova campanha
node reset-campaign.js new

# Criar campanha com duração específica
node reset-campaign.js new 7
```
- ✅ Reseta `current_day` para 1
- ✅ Mantém respostas dos usuários
- ✅ Permite criar nova campanha

## 📊 **Fluxo de Trabalho**

### **1. Primeira Configuração:**
```bash
# 1. Atualizar estrutura existente
node update-campaign-structure.js

# 2. Verificar status
node check-campaign-status.js

# 3. Se necessário, definir dia específico
node advance-campaign-day.js 2
```

### **2. Gerenciamento Diário:**
```bash
# Manhã: Verificar status
node check-campaign-status.js

# Avançar para próximo dia
node advance-campaign-day.js

# Verificar se funcionou
node check-campaign-status.js
```

### **3. Reiniciar para Nova Campanha:**
```bash
# Reiniciar campanha atual
node reset-campaign.js

# OU criar nova campanha
node reset-campaign.js new 5
```

## 🎯 **Exemplos de Uso**

### **Campanha de 4 dias:**
```bash
# Dia 1: Início
node advance-campaign-day.js 1

# Dia 2: Avançar
node advance-campaign-day.js

# Dia 3: Avançar
node advance-campaign-day.js

# Dia 4: Final
node advance-campaign-day.js
```

### **Campanha de 7 dias:**
```bash
# Criar nova campanha
node reset-campaign.js new 7

# Avançar dias
node advance-campaign-day.js 3
node advance-campaign-day.js 5
node advance-campaign-day.js 7
```

## 🔧 **Backend - Mudanças Implementadas**

### **`routes/questions.js`:**
- ✅ `getCurrentDay()` agora usa `current_day` da configuração
- ✅ Rota `/available` retorna `maxDays` da configuração
- ✅ Validação baseada em `current_day` e `duracao_dias`

### **`routes/auth-firebase.js`:**
- ✅ Mantém compatibilidade com sistema existente
- ✅ Usa valores padrão se `current_day` não estiver definido

## 🎨 **Frontend - Mudanças Implementadas**

### **`App.tsx`:**
- ✅ Exibe "DIA XX de YY" usando `maxDays` da API
- ✅ Carrega `maxDays` junto com `currentDay`
- ✅ Interface TypeScript atualizada

### **`services/api.ts`:**
- ✅ Interface `AvailableQuestionsResponse` inclui `maxDays`
- ✅ Compatível com nova estrutura da API

## ⚠️ **Validações de Segurança**

### **Backend:**
- ✅ Usuários só acessam desafios do dia atual e anteriores
- ✅ Validação de `current_day` vs `duracao_dias`
- ✅ Logs de tentativas de acesso não autorizado

### **Frontend:**
- ✅ Exibição correta do progresso
- ✅ Interface adaptativa baseada em `maxDays`

## 📝 **Comandos Úteis**

### **Verificar Status:**
```bash
node check-campaign-status.js
```

### **Avançar Dia:**
```bash
node advance-campaign-day.js
```

### **Definir Dia Específico:**
```bash
node advance-campaign-day.js 3
```

### **Reiniciar Campanha:**
```bash
node reset-campaign.js
```

### **Nova Campanha:**
```bash
node reset-campaign.js new 5
```

## 🎉 **Benefícios da Nova Arquitetura**

1. **Controle Manual:** Avance dias quando quiser
2. **Flexibilidade:** Campanhas de qualquer duração
3. **Segurança:** Validação rigorosa de acesso
4. **Transparência:** Status claro da campanha
5. **Compatibilidade:** Funciona com sistema existente

## 🚀 **Pronto para Uso!**

Agora você tem controle total sobre o progresso da campanha! 🎯 