# 🔐 Configuração da Autenticação

## Visão Geral
O sistema agora usa autenticação segura com bcrypt para verificar senhas no banco de dados.

## Passos para Configurar

### 1. Atualizar Senhas dos Usuários
Execute o script para atualizar as senhas dos usuários existentes:

```bash
cd backend
node update-passwords.js
```

### 2. Testar Autenticação
Execute o script de teste para verificar se a autenticação está funcionando:

```bash
node test-auth.js
```

### 3. Credenciais de Acesso
- **Logins disponíveis:** aluno001, aluno002, aluno003, ..., aluno010
- **Senha:** 123 (para todos os usuários)

## Como Funciona

### Backend (auth.js)
- Usa `bcrypt.compare()` para verificar senhas
- Calcula nível baseado em 50 XP por nível
- Gera token JWT para sessão

### Frontend (Home.tsx)
- Mostra credenciais claras no modal de login
- Interface amigável para autenticação

## Estrutura do Banco

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,  -- Hash bcrypt
  turma TEXT NOT NULL,
  escola TEXT NOT NULL,
  xp_atual INTEGER DEFAULT 0,
  -- ... outros campos
);
```

## Segurança
- Senhas são hasheadas com bcrypt (salt rounds: 10)
- Tokens JWT com expiração de 24h
- Validação de entrada no backend
- Mensagens de erro seguras

## Troubleshooting

### Senha não funciona
1. Execute `node update-passwords.js`
2. Execute `node test-auth.js` para verificar
3. Reinicie o servidor

### Usuário não encontrado
1. Verifique se o banco foi inicializado
2. Execute `node init-db.js` se necessário

### Erro de conexão
1. Verifique as variáveis de ambiente
2. Confirme se o banco está rodando 