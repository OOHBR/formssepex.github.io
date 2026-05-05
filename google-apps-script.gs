/**
 * Google Apps Script — Adesão ao Código de Conduta Ética e Conformidade — SEPEX-MG
 * Recebe dados do formulário via POST e grava em uma planilha do Google Sheets.
 *
 * INSTRUÇÕES DE IMPLANTAÇÃO:
 * 1. Crie uma planilha no Google Sheets e copie o ID dela (na URL).
 * 2. Abra Extensões > Apps Script nessa planilha.
 * 3. Cole este código, substituindo COLE_AQUI_O_ID_DA_PLANILHA.
 * 4. Clique em Implantar > Novo implantação > App da Web.
 * 5. Executar como: Eu | Quem tem acesso: Qualquer pessoa.
 * 6. Autorize e copie a URL gerada.
 * 7. Cole a URL na variável GOOGLE_SCRIPT_URL do script.js.
 */

const SPREADSHEET_ID = "COLE_AQUI_O_ID_DA_PLANILHA";
const SHEET_NAME = "Respostas";

const HEADERS = [
  "Timestamp",
  "Nome da empresa",
  "CNPJ",
  "Nome do responsável",
  "Cargo/função",
  "E-mail corporativo",
  "Telefone",
  "Minha empresa conhece e respeita o prazo de carência de 60 dias.",
  "Minha empresa se compromete a não interferir em contratos vigentes de outras associadas.",
  "Nossa empresa possui ou está implementando um programa interno de compliance/integridade.",
  "Nossos colaboradores são orientados sobre as regras anticorrupção (Lei 12.846/2013).",
  "Nossa empresa realiza manutenção preventiva regular dos engenhos publicitários.",
  "Temos procedimento de descarte adequado para lonas e materiais utilizados.",
  "Nossa empresa coleta apenas os dados necessários para execução dos contratos.",
  "Temos ou estamos indicando um Encarregado de Dados (DPO).",
  "Declaro ciência e adesão ao Código de Ética do SEPEX-MG.",
  "Dúvidas, comentários ou pedidos de orientação",
  "User Agent",
  "Origem da página"
];

const REQUIRED_FIELDS = [
  "empresa",
  "cnpj",
  "responsavel",
  "cargo",
  "email",
  "telefone",
  "carencia60dias",
  "naoInterfere",
  "compliance",
  "anticorrupcao",
  "manutencao",
  "descarte",
  "lgpdColeta",
  "dpo",
  "declaracao"
];

function doPost(e) {
  try {
    // Parse o corpo da requisição
    var data = JSON.parse(e.postData.contents);

    // Validação mínima de campos obrigatórios
    var missing = [];
    REQUIRED_FIELDS.forEach(function(field) {
      if (!data[field] || String(data[field]).trim() === "") {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return buildResponse(false, "Campos obrigatórios ausentes: " + missing.join(", "));
    }

    // Abre a planilha
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Cria a aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Adiciona cabeçalhos se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Formata o cabeçalho
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0d6eff");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Timestamp automático
    var timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    // Monta a linha de dados na ordem dos cabeçalhos
    var row = [
      timestamp,
      data.empresa || "",
      data.cnpj || "",
      data.responsavel || "",
      data.cargo || "",
      data.email || "",
      data.telefone || "",
      data.carencia60dias || "",
      data.naoInterfere || "",
      data.compliance || "",
      data.anticorrupcao || "",
      data.manutencao || "",
      data.descarte || "",
      data.lgpdColeta || "",
      data.dpo || "",
      data.declaracao || "",
      data.duvidas || "",
      data.userAgent || "",
      data.origemPagina || ""
    ];

    // Grava a linha na planilha
    sheet.appendRow(row);

    // Auto-ajusta largura das colunas (apenas nas primeiras 100 linhas para performance)
    if (sheet.getLastRow() <= 5) {
      sheet.autoResizeColumns(1, HEADERS.length);
    }

    return buildResponse(true, "Adesão registrada com sucesso.");

  } catch (err) {
    return buildResponse(false, "Erro interno: " + err.message);
  }
}

function buildResponse(success, message) {
  var output = ContentService.createTextOutput(
    JSON.stringify({ success: success, message: message })
  );
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// Função de teste (execute manualmente no editor para testar)
function testDoPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        empresa: "Empresa Teste LTDA",
        cnpj: "12.345.678/0001-99",
        responsavel: "João da Silva",
        cargo: "Diretor",
        email: "joao@empresa.com.br",
        telefone: "(31) 99999-9999",
        carencia60dias: "Sim",
        naoInterfere: "Concordo",
        compliance: "Sim, já temos",
        anticorrupcao: "Sim",
        manutencao: "Sim",
        descarte: "Sim",
        lgpdColeta: "Sim",
        dpo: "Sim",
        declaracao: "Sim, declaro",
        duvidas: "",
        userAgent: "Teste Manual",
        origemPagina: "https://localhost/teste"
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
