const express = require("express");
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = require('./db');

app.post("/cadastros", async (req, res) => {
  const d = req.body;

  try {
    // Verificar duplicidade por CPF e empreendimento
    const existente = await pool.query(
      "SELECT * FROM cadastros WHERE cpf1 = $1 AND empreendimento = $2",
      [d.cpf1, d.empreendimento]
    );

    if (existente.rows.length > 0) {
      return res.status(200).json({
        statuscadastro: "Status: Erro - Duplicidade no cadastro",
        mensagemcadastro: "Mensagem: Verifique se este cliente já está cadastrado para o empreendimento em tela. Ou caso deseje editar clique em avançar para editar os dados do cliente."
      });
    }

    // Inserção no banco
    await pool.query(`
      INSERT INTO cadastros (
        empreendimento, nomecompleto1, datanascimento1, profissao1, contato1, cpf1, rg1, estadocivil1,
        temconjugue, nomecompleto2, datanascimento2, profissao2, contato2, cpf2, rg2, estadocivil2,
        rua, casanumero, bairro, cidadeuf, cep
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    `, [
      d.empreendimento, d.nomecompleto1, d.datanascimento1, d.profissao1, d.contato1, d.cpf1,
      d.rg1, d.estadocivil1, d.temconjugue, d.nomecompleto2, d.datanascimento2, d.profissao2,
      d.contato2, d.cpf2, d.rg2, d.estadocivil2, d.rua, d.casanumero, d.bairro, d.cidadeuf, d.cep
    ]);

    // Resposta de sucesso para Zeev
    res.json({
      statuscadastro: "Status: Cadastro realizado com sucesso",
      mensagemcadastro: "Mensagem: Clique em avançar para finalizar."
    });

  } catch (err) {
    console.error("Erro detalhado:", err);

    res.status(500).json({
      statuscadastro: "Status: Erro",
      mensagemcadastro: "Mensagem: Foi identificado algum erro na API, entre em contato com o administrador."
    });
  }
});

app.get("/cadastros", async (req, res) => {
  try {
    const { cpf1, nomecompleto1, empreendimento } = req.query;

    const filtros = [];
    const valores = [];

    if (cpf1) {
      filtros.push("REPLACE(REPLACE(cpf1, '.', ''), '-', '') = REPLACE(REPLACE($" + (valores.length + 1) + ", '.', ''), '-', '')");
      valores.push(cpf1);
    }

    if (nomecompleto1) {
      filtros.push("nomecompleto1 ILIKE $" + (valores.length + 1));
      valores.push(`%${nomecompleto1}%`);
    }

    if (empreendimento) {
      filtros.push("empreendimento ILIKE $" + (valores.length + 1));
      valores.push(`%${empreendimento}%`);
    }

    let sql = "SELECT * FROM cadastros";
    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }
    sql += " LIMIT 50";

    const result = await pool.query(sql, valores);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na consulta GET:", err);
    res.status(500).json({ error: "Erro ao buscar cadastros." });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
