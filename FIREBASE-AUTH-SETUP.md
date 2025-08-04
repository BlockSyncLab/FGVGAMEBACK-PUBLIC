# 🔐 Configuração da Autenticação com Firebase

## Visão Geral
O sistema usa autenticação simples com validação de string para verificar senhas no Firebase Realtime Database.

## Passos para Configurar

### 1. Atualizar Senhas dos Usuários no Firebase
Execute o script para atualizar as senhas dos usuários existentes:

```bash
cd backend
node update-simple-passwords.js
```

### 2. Testar Autenticação
Execute o script de teste para verificar se a autenticação está funcionando:

```bash
node debug-auth.js
```

### 3. Credenciais de Acesso
- **aluno001:** teste123
- **aluno002-aluno010:** 123

## Como Funciona

### Backend (auth-firebase.js)
- Busca usuário no Firebase por login
- Verifica se o usuário tem senha definida
- Usa comparação de string simples (`senha === user.senha`)
- Calcula nível baseado em 50 XP por nível
- Gera token JWT para sessão

### Frontend (Home.tsx)
- Mostra credenciais claras no modal de login
- Interface amigável para autenticação

## Estrutura do Firebase

```json
{
  "users": {
    "1": {
      "id": 1,
      "login": "aluno001",
      "senha": "teste123", // String simples
      "turma": "3ª Série A",
      "escola": "Colégio Estadual da Bahia",
      "xp_atual": 490,
      "erros": 2,
      "response_q1": true,
      "response_q2": false,
      // ... outros campos
    }
  }
}
```

## Segurança
- Senhas são armazenadas como strings simples
- Tokens JWT com expiração de 24h
- Validação de entrada no backend
- Mensagens de erro seguras
- Verificação de existência de senha

## Troubleshooting

### Senha não funciona
1. Execute `node debug-auth.js` para verificar estrutura
2. Execute `node update-simple-passwords.js`
3. Execute `node debug-auth.js` para verificar
4. Reinicie o servidor

### Usuário sem senha definida
1. Verifique se o Firebase tem dados dos usuários
2. Execute `node update-simple-passwords.js`
3. Verifique se o campo `senha` foi adicionado

### Erro de conexão com Firebase
1. Verifique se o arquivo `serviceAccountKey.json` existe
2. Confirme se as credenciais do Firebase estão corretas
3. Verifique se o Firebase Realtime Database está ativo

### Usuário não encontrado
1. Verifique se os dados estão no Firebase
2. Execute `node debug-auth.js` para listar usuários
3. Confirme se o login está correto

## Scripts Disponíveis

- `update-simple-passwords.js` - Atualiza senhas como strings simples
- `debug-auth.js` - Testa autenticação
- `test-user-position.js` - Testa ranking de usuários 