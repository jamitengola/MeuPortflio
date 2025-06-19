// Backend Node.js para Chatbot de Diagnóstico Prévio
// Instale as dependências: express, cors, axios, dotenv
// npm install express cors axios dotenv

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Configurações do OpenAI/Azure OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

// Servir arquivos estáticos do portfólio (deve vir antes de qualquer rota)
app.use(express.static(path.join(__dirname)));

// Endpoint do chatbot
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensagem obrigatória." });

  try {
    // Exemplo usando Azure OpenAI (GPT-4o)
    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [
          {
            role: "system",
            content: `
Você é o assistente virtual oficial de Jamite Ngola, desenvolvedor de software. Seu objetivo é apresentar de forma clara e objetiva:
- A bio e a experiência profissional do Jamite Ngola;
- Os principais projetos (como o site Uma.co.ao, o Sistema de Gestão de Passes Institucionais, o canal de YouTube “yzykey”);
- As tecnologias e linguagens que ele domina (C#, .NET 8, Next.js, React, Flutter, Python, RabbitMQ, YARP, Clean Architecture, etc.);
- Suas conquistas e prêmios (Certificate of Merit, medalhas na Ideas & Innovation Fair, Imagine Cup 2016, University Game Developers);
- Links relevantes (GitHub, LinkedIn, portfólio, vídeos no YouTube);
- **Como solicitar os serviços do Jamite Ngola**: descreva passo a passo o processo de contato (e‑mail, formulário no portfólio, redes sociais), prazos de retorno, tipos de projetos atendidos e política de orçamento.

Sempre responda mantendo o foco exclusivo nesses tópicos, sem divagar para assuntos externos ou temas que não estejam diretamente ligados ao perfil, projetos e oferta de serviços do Jamite Ngola.
  `.trim(),
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.2,
      },
      {
        headers: {
          "api-key": AZURE_OPENAI_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(
      "Erro detalhado:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({
      error: "Erro ao consultar o assistente.",
      details: err.response ? err.response.data : err.message,
    });
  }
});

// Endpoint para receber diagnóstico e enviar por e-mail
app.post("/api/diagnostico", async (req, res) => {
  const { nome, email, tipo, resumo } = req.body;
  if (!nome || !email || !tipo || !resumo)
    return res
      .status(400)
      .json({ success: false, error: "Dados incompletos." });
  try {
    // Configure o transporter com seu e-mail (exemplo com Gmail, ajuste se necessário)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // coloque seu e-mail
        pass: process.env.EMAIL_PASS, // coloque sua senha ou app password
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "jamitengol@hotmail.com",
      subject: "Novo diagnóstico prévio do portfólio",
      html: `<b>Nome:</b> ${nome}<br><b>E-mail:</b> ${email}<br><b>Tipo:</b> ${tipo}<br><b>Mensagem:</b> ${resumo}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    res.json({ success: false, error: "Erro ao enviar e-mail." });
  }
});

// Fallback: qualquer rota GET que não seja /api retorna index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Chatbot backend rodando na porta ${PORT}`);
});

// Crie um arquivo .env com as variáveis fornecidas no seu pedido.
