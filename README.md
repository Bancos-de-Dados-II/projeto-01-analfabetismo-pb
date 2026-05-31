Markdown
# 🗺️ API - Mapa do Analfabetismo na Paraíba (Back-end)

Esta é a API RESTful responsável por fornecer os dados estatísticos e geoespaciais sobre as taxas de analfabetismo nos municípios da Paraíba. O projeto faz parte da disciplina de desenvolvimento do IFPB e serve como base para a renderização do mapa interativo no Front-end.

A API está a processar geometrias complexas diretamente na base de dados utilizando o PostGIS e devolve os dados prontos a serem consumidos por bibliotecas de mapas como o Leaflet.

## 🚀 Tecnologias Utilizadas
* **Node.js** - Ambiente de execução do servidor.
* **PostgreSQL + PostGIS** - Base de dados relacional com extensão espacial para processamento dos mapas.
* **Supabase** - Alojamento da base de dados na nuvem (com Connection Pooling para compatibilidade IPv4).
* **Render** - Alojamento (Deploy) da API.

## 🔗 Endpoints (Rotas da API)

A API já está em produção no Render. A equipa de Front-end pode consumir os dados diretamente através dos links abaixo:

### 1. Dados Estatísticos
Retorna um JSON contendo as informações em formato de tabela (Código IBGE, Nome, Taxa de Analfabetismo, etc.). Ideal para a construção de tabelas e gráficos.
* **URL:** `https://api-analfabetismo-pb.onrender.com/dados`
* **Método:** `GET`

### 2. Dados Geoespaciais (Mapa)
Retorna um `FeatureCollection` no padrão GeoJSON contendo as coordenadas geográficas (polígonos) das fronteiras dos municípios. Ideal para injetar diretamente no Leaflet.
* **URL:** `https://api-analfabetismo-pb.onrender.com/municipios`
* **Método:** `GET`

---

## 💻 Como correr o projeto localmente

Caso algum membro da equipa precise de testar o servidor Node.js na própria máquina, basta seguir os passos:

1. Clone o repositório:
```bash
git clone https://github.com/Bancos-de-Dados-II/projeto-01-analfabetismo-pb.git

Instale as dependências:

Bash
npm install
Crie um ficheiro .env na raiz do projeto e solicite a String de Conexão ao administrador do banco de dados (Francisco Khauê). O ficheiro deve seguir este formato:

Snippet de código
DATABASE_URL="postgresql://postgres.toecgxpcdzjqwqgyhtgo:[SENHA]@[aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true)"
Inicie o servidor:

Bash
npm start
# O servidor estará a correr em http://localhost:10000 (ou na porta definida)
Desenvolvido na infraestrutura de Back-end por Francisco Khauê.