// Backend Node.js para Chatbot de Diagnóstico Prévio
// Instale as dependências: express, cors, axios, dotenv
// npm install express cors axios dotenv

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configurações do OpenAI/Azure OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

// Endpoint do chatbot
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem obrigatória.' });

  try {
    // Exemplo usando Azure OpenAI (GPT-4o)
    const response = await axios.post(
      `${AZURE_OPENAI_ENDPOINT}openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [
          { role: 'system', content: 'Você é um assistente virtual para diagnóstico prévio de clientes.' },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.2
      },
      {
        headers: {
          'api-key': AZURE_OPENAI_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error('Erro detalhado:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Erro ao consultar o assistente.', details: err.response ? err.response.data : err.message });
  }
});

// Servir arquivos estáticos do portfólio
app.use(express.static(path.join(__dirname)));

// Redirecionar / para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chatbot backend rodando na porta ${PORT}`);
});

// Crie um arquivo .env com as variáveis fornecidas no seu pedido.
