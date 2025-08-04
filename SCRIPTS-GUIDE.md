# 📚 Guia de Scripts - EDURATS

## 🎯 **Scripts Disponíveis**

### 1. **Importação do Google Sheets (V2)**
**Arquivo:** `import-google-sheets-v2.js`

**Uso:**
```bash
node import-google-sheets-v2.js
```

**Funcionalidades:**
- ✅ Importa usuários da planilha do Google Sheets
- ✅ Cria IDs numéricos sequenciais (1, 2, 3, ...)
- ✅ Gera questões únicas para cada usuário
- ✅ Define valores padrão (escola, série, XP)
- ✅ Atualiza usuários existentes

**Estrutura da Planilha:**
- Coluna A: Nome
- Coluna B: Login
- Coluna C: Turma
- Coluna D: Senha

### 2. **Adicionar Novas Questões**
**Arquivo:** `add-new-questions.js`

**Uso:**
```bash
# Adicionar novas questões
node add-new-questions.js

# Listar todas as questões
node add-new-questions.js list
```

**Funcionalidades:**
- ✅ Adiciona novas questões ao Firebase
- ✅ Lista todas as questões existentes
- ✅ Gera IDs automaticamente

### 3. **Criar Questões de Exemplo**
**Arquivo:** `create-sample-questions.js`

**Uso:**
```bash
node create-sample-questions.js
```

**Funcionalidades:**
- ✅ Cria 5 questões de exemplo sobre a Bahia
- ✅ Configura campanha para começar hoje
- ✅ Define duração de 4 dias

### 4. **Testar API de Questões**
**Arquivo:** `test-questions-api.js`

**Uso:**
```bash
node test-questions-api.js
```

**Funcionalidades:**
- ✅ Testa conexão com Firebase
- ✅ Verifica questões e usuários
- ✅ Simula chamadas da API

## 🔧 **Configuração**

### **Google Sheets**
1. Configure as credenciais no início do script:
   ```javascript
   const SPREADSHEET_ID = 'SEU_ID_DA_PLANILHA';
   const GOOGLE_SERVICE_ACCOUNT_EMAIL = 'SEU_EMAIL';
   const GOOGLE_PRIVATE_KEY = 'SUA_CHAVE_PRIVADA';
   ```

2. Compartilhe a planilha com o email da conta de serviço

### **Firebase**
- Certifique-se de que o Firebase está configurado corretamente
- Verifique se as credenciais estão no arquivo `config.env`

## 📊 **Estrutura dos Dados**

### **Usuário no Firebase:**
```javascript
{
  id: 1,                    // ID numérico sequencial
  login: "usuario@email.com",
  nome: "Nome do Usuário",
  turma: "Turma A",
  senha: "senha123",
  escola: "FGV MALHADOS INTELECTUAIS",
  serie: "EQUIPE BASE",
  xp_atual: 0,              // XP inicial
  erros: 0,
  id_q1: 3,                 // ID da questão 1 (1-5)
  response_q1: false,        // Se já respondeu
  id_q2: 1,                 // ID da questão 2 (1-5)
  response_q2: false,
  id_q3: 5,                 // ID da questão 3 (1-5)
  response_q3: false,
  id_q4: 2,                 // ID da questão 4 (1-5)
  response_q4: false
}
```

### **Questão no Firebase:**
```javascript
{
  id: 1,
  pergunta: "Pergunta aqui?",
  dica: "Dica para a pergunta",
  a1: "Alternativa 1",
  a2: "Alternativa 2",
  a3: "Alternativa 3",
  a4: "Alternativa 4",
  a5: "Alternativa 5",
  ac: 1                     // Resposta correta (1-5)
}
```

## 🚀 **Fluxo de Trabalho**

### **1. Primeira Configuração:**
```bash
# 1. Criar questões de exemplo
node create-sample-questions.js

# 2. Importar usuários da planilha
node import-google-sheets-v2.js

# 3. Testar se tudo está funcionando
node test-questions-api.js
```

### **2. Adicionar Novos Usuários:**
```bash
# Atualizar planilha do Google Sheets
# Executar importação
node import-google-sheets-v2.js
```

### **3. Adicionar Novas Questões:**
```bash
# 1. Editar o arquivo add-new-questions.js
# 2. Adicionar novas questões no array newQuestions
# 3. Executar
node add-new-questions.js

# 4. Verificar se foram criadas
node add-new-questions.js list
```

## ⚠️ **Problemas Comuns**

### **Erro 403 - Acesso Negado:**
- Verifique se a planilha foi compartilhada com o email da conta de serviço
- Verifique se a Google Sheets API está ativada

### **Erro de ID undefined:**
- Execute o script de recriação de usuários
- Verifique se os IDs estão sendo gerados corretamente

### **Questões não aparecem:**
- Verifique se há questões no Firebase
- Execute `node add-new-questions.js list` para listar questões

## 📝 **Notas Importantes**

1. **IDs Numéricos:** Todos os usuários agora têm IDs numéricos (1, 2, 3, ...)
2. **Questões Únicas:** Cada usuário recebe 4 questões únicas (1-5)
3. **XP Inicial:** Todos os usuários começam com 0 XP
4. **Valores Padrão:** Escola e série são definidos automaticamente

## 🎉 **Pronto para Uso!**

Agora você tem todos os scripts necessários para:
- ✅ Importar usuários da planilha
- ✅ Adicionar novas questões
- ✅ Testar o sistema
- ✅ Manter o banco de dados atualizado

## 🚀 **Scripts de Campanha (Automático)**

### **Sistema Automático de Atualização:**
O servidor agora inicia automaticamente o sistema de atualização da campanha. Não é necessário executar manualmente.

### **Scripts Manuais (se necessário):**

#### `check-campaign-status.js`
**Uso:** `node check-campaign-status.js`
**Descrição:** Mostra o status atual da campanha, progresso e desafios disponíveis.

#### `force-advance-campaign.js`
**Uso:** `node force-advance-campaign.js`
**Descrição:** Força a atualização da campanha para o dia correto baseado na data real.
**Nota:** Útil quando o sistema automático não funcionou corretamente.

#### `advance-campaign-day.js`
**Uso:** `node advance-campaign-day.js [dia]`
**Descrição:** Avança manualmente o dia da campanha ou define um dia específico.
**Exemplo:** 
- `node advance-campaign-day.js` - Avança para o próximo dia
- `node advance-campaign-day.js 3` - Define o dia como 3

#### `reset-campaign.js`
**Uso:** `node reset-campaign.js [duração]`
**Descrição:** Reseta a campanha para o dia 1 ou cria uma nova campanha.
**Exemplo:**
- `node reset-campaign.js` - Reseta para dia 1
- `node reset-campaign.js 5` - Cria nova campanha com 5 dias de duração

#### `test-auto-advance.js`
**Uso:** `node test-auto-advance.js`
**Descrição:** Testa o sistema de atualização automática por 5 minutos. 