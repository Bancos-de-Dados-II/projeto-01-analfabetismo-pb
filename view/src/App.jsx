import { useEffect, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapContainer from "./components/MapContainer";
import DashboardPanel from "./components/DashboardPanel";

import { buscarMunicipios } from "./api/municipios";

function App() {
  const [municipios, setMunicipios] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroAnalfabetismo, setFiltroAnalfabetismo] = useState("");
  const [filtroEscolas, setFiltroEscolas] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarMunicipios();

        console.log("Municípios:", dados);

        setMunicipios(dados);
      } catch (error) {
        console.error("Erro ao carregar municípios:", error);
      }
    }

    carregarDados();
  }, []);

  const municipiosFiltrados = municipios.filter((municipio) => {
    const nomeValido = municipio.nome_municipio
      .toLowerCase()
      .includes(busca.toLowerCase());

    let analfabetismoValido = true;

    if (filtroAnalfabetismo === "0-5") {
      analfabetismoValido =
        municipio.taxa_analfabetismo >= 0 &&
        municipio.taxa_analfabetismo < 5;
    }

    if (filtroAnalfabetismo === "5-10") {
      analfabetismoValido =
        municipio.taxa_analfabetismo >= 5 &&
        municipio.taxa_analfabetismo < 10;
    }

    if (filtroAnalfabetismo === "10-15") {
      analfabetismoValido =
        municipio.taxa_analfabetismo >= 10 &&
        municipio.taxa_analfabetismo < 15;
    }

    if (filtroAnalfabetismo === "15+") {
      analfabetismoValido =
        municipio.taxa_analfabetismo >= 15;
    }

    let escolasValido = true;

    if (filtroEscolas === "0-20") {
      escolasValido =
        municipio.qtd_escolas >= 0 &&
        municipio.qtd_escolas < 20;
    }

    if (filtroEscolas === "20-50") {
      escolasValido =
        municipio.qtd_escolas >= 20 &&
        municipio.qtd_escolas < 50;
    }

    if (filtroEscolas === "50+") {
      escolasValido =
        municipio.qtd_escolas >= 50;
    }

    return (
      nomeValido &&
      analfabetismoValido &&
      escolasValido
    );
  });

  return (
    <>
      <Header
        busca={busca}
        setBusca={setBusca}
      />

      <div className="layout">
        <Sidebar
          municipios={municipiosFiltrados}
          filtroAnalfabetismo={filtroAnalfabetismo}
          setFiltroAnalfabetismo={setFiltroAnalfabetismo}
          filtroEscolas={filtroEscolas}
          setFiltroEscolas={setFiltroEscolas}
        />

        <MapContainer />
      </div>

      <DashboardPanel />
    </>
  );
}

export default App;