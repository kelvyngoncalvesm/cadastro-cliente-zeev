const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./cadastros.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cadastros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empreendimento TEXT,
      nomecompleto1 TEXT,
      datanascimento1 TEXT,
      profissao1 TEXT,
      contato1 TEXT,
      cpf1 TEXT,
      rg1 TEXT,
      estadocivil1 TEXT,
      temconjugue TEXT,
      nomecompleto2 TEXT,
      datanascimento2 TEXT,
      profissao2 TEXT,
      contato2 TEXT,
      cpf2 TEXT,
      rg2 TEXT,
      estadocivil2 TEXT,
      rua TEXT,
      casanumero TEXT,
      bairro TEXT,
      cidadeuf TEXT,
      cep TEXT
    )
  `);
});

module.exports = db;
