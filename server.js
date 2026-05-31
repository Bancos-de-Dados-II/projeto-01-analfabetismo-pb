require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Permite que o Front-end (em outro domínio) acesse sua API sem ser bloqueado
app.use(cors());

// Conexão com o Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rota 1: Entrega os polígonos e os dados do IBGE para o mapa (Leaflet)
app.get('/municipios', async (req, res) => {
  try {
    const result = await pool.query('SELECT obter_municipios_geojson() AS mapa_geojson;');
    res.json(result.rows[0].mapa_geojson);
  } catch (err) {
    console.error('Erro no PostGIS:', err);
    res.status(500).json({ error: 'Erro ao buscar dados geográficos' });
  }
});

// Rota 2: Entrega apenas os dados em formato de lista (para gráficos ou tabelas)
app.get('/dados', async (req, res) => {
  try {
    const result = await pool.query('SELECT code_muni, nome_municipio, taxa_analfabetismo, qtd_escolas FROM municipios ORDER BY nome_municipio;');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro na listagem:', err);
    res.status(500).json({ error: 'Erro ao buscar dados tabulares' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});