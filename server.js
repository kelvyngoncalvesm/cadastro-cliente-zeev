const express = require("express");
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/cadastros", (req, res) => {
  const dados = req.body;
  const stmt = db.prepare(`
    INSERT INTO cadastros (
      empreendimento, nomecompleto1, datanascimento1, profissao1, contato1, cpf1, rg1, estadocivil1,
      temconjugue, nomecompleto2, datanascimento2, profissao2, contato2, cpf2, rg2, estadocivil2,
      rua, casanumero, bairro, cidadeuf, cep
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    dados.empreendimento,
    dados.nomecompleto1,
    dados.datanascimento1,
    dados.profissao1,
    dados.contato1,
    dados.cpf1,
    dados.rg1,
    dados.estadocivil1,
    dados.temconjugue,
    dados.nomecompleto2,
    dados.datanascimento2,
    dados.profissao2,
    dados.contato2,
    dados.cpf2,
    dados.rg2,
    dados.estadocivil2,
    dados.rua,
    dados.casanumero,
    dados.bairro,
    dados.cidadeuf,
    dados.cep
  ]);
  stmt.finalize();
  res.json({ success: true });
});

app.get("/cadastros", (req, res) => {
  db.all("SELECT * FROM cadastros", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
