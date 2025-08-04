const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Configuração do Google Sheets
const SPREADSHEET_ID = '1FJR2OnyJDhSiETwUgyJKG6R1teoRvBdy6LWt7Wq5YZA';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = 'sheet-import@peaceful-oath-188414.iam.gserviceaccount.com';
const GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGTtJ5Rac/AP9K\nnLrP291u1zAjFwUhM+h+XQS8KXvjEisFMbJF2aA+Hm6G1Loo3hVP3D6Q9JzqvN9y\n/FkYGBhfywWJcb4pUSSoEiSe+8O6yQdrfDK2RQW7x36jAEkv0L4p9CjNOmDPwJs1\nrgzpKTLXTrlwSSRsJh5kSAa29YfbD+9lTgOHtjGHsIYZ3aFdq5W8f1BHd3FSLpyL\nIBpvvHV8Ma/RmjLH/Kfn0fGKWpZ0TlpWZRY6Ugv3Ng0oxVAYnkl7YnuHQsvGOHCh\nVXO0HdHVIzxc++cpHdSXPWRyRvYM+7k5kTX6VGqF2/N1WfZpgqU4BPVAtrX9hMVo\njIn6067FAgMBAAECggEAKV/hrva23cDOAtmvalXDnfActX2EjvhfDhpHNiDrnaU5\nP5SuTr+InN1Jjy0MCCHJzYc0sJawtJMihcGbrxi74SShK5uFIuawoLZkWJ1LqYlu\n2GCpzfiZqSOGyuhw3J6PRn6QEr2W3FGhsHH3dKApYN2meARyqnPLjH2wlPSmWzBa\nP8hHBwtqzMMzJkMIVOZdvP1BmbHiyPSKJWqZiyvRhAamJ+wzxUMGCQqGG+4wjfqK\nywtIwdDTYFryccqrdx6xi123i8Pkp3/CuVtqjnOx7WozUWABS+KKtMJxHmfc1qy4\nkszvEDtyv87/JwFRHkX8nuT+ZWI0bjMEV8tVsysFQwKBgQDvV03E0gOCvE5YG8Xx\nXvaVQiGfgs7YInOjE51U6VOmrXmq3bD1XdgcWs7tBwWpcGVYa6YHyso9WGpgacU1\neukdg+TIfX3+X1S2yFrXz+l7D6yQTq3mpDDTxvU4Ojf/jzWGVq72/4iicdyKCs0D\nYi4WwCYH2Pdh7XsDsSJdcX7ChwKBgQDUHF6vHNmLPymaNVuETFqxKdnDBf2PjojE\nw6ZmpPxO79Ec/a1tgO6EJ3+EtxMgXhWlVVct3l2AGGtVVhs37ghvsZh5VhKkWu11\nGM9mPrjnn8ODe68XyKgrNGgAxGuT5hNGJrIraWXnfUmeWCDc6A/gJY5NslNxv6xl\nnYvnAs67UwKBgH5A1IJNspJlWQJ7bBheWr7zip8FNq2mxs8wip7/EiRrgDHVDgLx\nBQ44DM3WFXODGcLhzkxv+e0QVdUUFnaWpp/uMmJcaHklup9M4zbSszw6UXIyPuPa\nmvMsEbEebOm/lqGN2m/q7h2a6JZdCjaNtPhFVgpvtlePGYQiDZmzRAXDAoGAeh9/\ncGk245JRPKU99NUVXm2PIFdBnzbcjhVrqCuTzUsMZhm0kZirO1GWfO3/SCKDafbR\nw+oEgW0N10tFTpVxLAXfmPSytQhZMZNATkkMoud8ZSaAMDxqfr2kp9Rvb+8G59v9\ntzru3jJngZCSEz5VbaOR5DApFRPbiYIE+9PE/VsCgYEAyPzBPdedizFhXx1Xbxri\nWrMh9gqe3aRjrtZPZxLruaA0uoOwO8a+D5Uy2d4iYlb3ehwkiu6L05AawM49vlDW\nnXjjlNNxWJvqWVYTb8vKameJ94A1DaoDw80aq9RbeBm2mClQPAhZ8BofPzl/1Vjw\n07R6FMpH/9xJ3bILXfdMiuc=\n-----END PRIVATE KEY-----\n';

async function testGoogleSheetsAccess() {
  try {
    console.log('🧪 Testando acesso ao Google Sheets...');
    console.log(`📋 ID da planilha: ${SPREADSHEET_ID}`);
    console.log(`👤 Email da conta de serviço: ${GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    
    // Configurar autenticação
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'https://spreadsheets.google.com/feeds'
      ],
    });

    console.log('🔐 Testando autenticação...');
    
    // Conectar à planilha
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    
    console.log('📋 Carregando informações da planilha...');
    await doc.loadInfo();
    
    console.log('✅ ✅ ✅ SUCESSO! Planilha acessível!');
    console.log(`📋 Título da planilha: ${doc.title}`);
    console.log(`📝 Total de planilhas: ${doc.sheetCount}`);
    
    // Listar todas as planilhas
    console.log('\n📋 Planilhas disponíveis:');
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.title} (${sheet.rowCount} linhas, ${sheet.columnCount} colunas)`);
    });
    
    // Testar acesso à primeira planilha
    const sheet = doc.sheetsByIndex[0];
    console.log(`\n📝 Testando acesso à planilha: ${sheet.title}`);
    
    await sheet.loadCells();
    console.log('✅ ✅ ✅ Células carregadas com sucesso!');
    
    // Testar leitura de algumas células
    console.log('\n📊 Testando leitura de células:');
    for (let row = 0; row < Math.min(5, sheet.rowCount); row++) {
      const cells = [];
      for (let col = 0; col < Math.min(4, sheet.columnCount); col++) {
        const cell = sheet.getCell(row, col);
        cells.push(cell.value || '');
      }
      console.log(`  Linha ${row + 1}: ${cells.join(' | ')}`);
    }
    
    console.log('\n🎉 Teste concluído com sucesso! A planilha está acessível.');
    
  } catch (error) {
    console.error('❌ ❌ ❌ ERRO no teste de acesso:');
    console.error(error.message);
    
    if (error.response) {
      console.error('\n📊 Detalhes do erro HTTP:');
      console.error(`  - Status: ${error.response.status}`);
      console.error(`  - Status Text: ${error.response.statusText}`);
      
      if (error.response.data && error.response.data.error) {
        console.error(`  - Código: ${error.response.data.error.code}`);
        console.error(`  - Mensagem: ${error.response.data.error.message}`);
      }
    }
    
    console.error('\n🔧 Soluções para problemas de acesso:');
    console.error('1. Verifique se a planilha foi compartilhada com o email da conta de serviço');
    console.error('2. Verifique se a conta de serviço tem permissão de "Editor" na planilha');
    console.error('3. Verifique se a Google Sheets API está ativada no Google Cloud Console');
    console.error('4. Verifique se as credenciais estão corretas');
    console.error('5. Verifique se o ID da planilha está correto');
  }
}

// Executar teste
if (require.main === module) {
  testGoogleSheetsAccess();
}

module.exports = { testGoogleSheetsAccess }; 