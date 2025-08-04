# 📊 Importação do Google Sheets para Firebase

## Visão Geral
Este script permite importar dados de usuários de uma planilha do Google Sheets para o Firebase Realtime Database.

## Pré-requisitos

### 1. Instalar Dependências
```bash
cd backend
npm install google-spreadsheet google-auth-library
```

### 2. Configurar Google Cloud Console

#### Passo 1: Criar Projeto no Google Cloud
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Sheets API

#### Passo 2: Criar Conta de Serviço
1. Vá para "IAM & Admin" > "Service Accounts"
2. Clique em "Create Service Account"
3. Dê um nome à conta (ex: "sheets-import")
4. Clique em "Create and Continue"
5. Pule as permissões e clique em "Done"

#### Passo 3: Gerar Chave Privada
1. Clique na conta de serviço criada
2. Vá para a aba "Keys"
3. Clique em "Add Key" > "Create new key"
4. Selecione "JSON" e clique em "Create"
5. Baixe o arquivo JSON

#### Passo 4: Extrair Credenciais
No arquivo JSON baixado, você encontrará:
- `client_email`: Email da conta de serviço
- `private_key`: Chave privada

## Configuração da Planilha

### Estrutura Esperada
| Coluna A | Coluna B | Coluna C | Coluna D |
|----------|----------|----------|----------|
| Nome     | Login    | Turma    | Senha    |
| João     | aluno001 | 3ª Série A | 123      |
| Maria    | aluno002 | 3ª Série A | 123      |

### Compartilhar Planilha
1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar"
3. Adicione o email da conta de serviço com permissão de "Editor"
4. Copie o ID da planilha da URL

## Configuração do Script

### 1. Editar Variáveis
Abra `backend/import-google-sheets.js` e configure:

```javascript
const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Seu ID
const GOOGLE_SERVICE_ACCOUNT_EMAIL = 'sheets-import@project.iam.gserviceaccount.com'; // Email da conta
const GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n...'; // Chave privada
```

### 2. Executar Importação
```bash
cd backend
node import-google-sheets.js
```

## Funcionalidades

### ✅ Recursos Implementados
- **Leitura automática:** Lê todas as linhas da planilha
- **Validação de dados:** Verifica se todos os campos estão preenchidos
- **Atualização inteligente:** Atualiza usuários existentes ou cria novos
- **Campos automáticos:** Adiciona campos padrão do Firebase
- **Log detalhado:** Mostra progresso e resumo da importação

### 🔄 Processo de Importação
1. **Lê planilha:** Acessa o Google Sheets via API
2. **Valida dados:** Verifica se as 4 colunas estão preenchidas
3. **Busca existentes:** Verifica usuários já no Firebase
4. **Atualiza/Cria:** Atualiza existentes ou cria novos
5. **Adiciona campos:** Inclui campos padrão (XP, questões, etc.)

### 📊 Campos Adicionados Automaticamente
```javascript
{
  escola: 'Colégio Estadual da Bahia',
  serie: '3ª Série', // Extraído da turma
  xp_atual: 0,
  erros: 0,
  id_q1: null,
  response_q1: null,
  // ... outros campos de questões
}
```

## Troubleshooting

### Erro de Autenticação
```
❌ Erro na importação: Invalid Credentials
```
**Solução:** Verifique se o email e chave privada estão corretos

### Erro de Permissão
```
❌ Erro na importação: Access Denied
```
**Solução:** Compartilhe a planilha com o email da conta de serviço

### Erro de API
```
❌ Erro na importação: Google Sheets API not enabled
```
**Solução:** Ative a Google Sheets API no Google Cloud Console

### Planilha Vazia
```
👥 Encontrados 0 usuários na planilha
```
**Solução:** Verifique se a planilha tem dados e se a primeira linha não é cabeçalho

## Exemplo de Uso

### Planilha de Exemplo
```
Nome    | Login     | Turma        | Senha
João    | aluno001  | 3ª Série A   | 123
Maria   | aluno002  | 3ª Série A   | 123
Pedro   | aluno003  | 3ª Série B   | 123
```

### Resultado no Firebase
```javascript
{
  "1": {
    "id": 1,
    "login": "aluno001",
    "nome": "João",
    "turma": "3ª Série A",
    "senha": "123",
    "escola": "Colégio Estadual da Bahia",
    "serie": "3ª Série",
    "xp_atual": 0,
    "erros": 0,
    // ... outros campos
  }
}
```

## Segurança

### 🔐 Boas Práticas
- **Não commitar credenciais:** Use variáveis de ambiente
- **Permissões mínimas:** Dê apenas acesso de leitura à planilha
- **Conta de serviço dedicada:** Use conta específica para importação
- **Validação de dados:** Sempre valide os dados antes de importar

### 🛡️ Configuração Segura
```javascript
// Use variáveis de ambiente
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
``` 