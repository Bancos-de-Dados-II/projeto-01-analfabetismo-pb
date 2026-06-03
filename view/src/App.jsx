import { useEffect, useState, useMemo } from "react";

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
  const [municipioSelecionado, setMunicipioSelecionado] = useState(null);
  const [coordenadasEndereco, setCoordenadasEndereco] = useState(null);

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

  const mediasEstaduais = useMemo(() => {
    if (municipios.length === 0) return { analfabetismo: 0, escolas: 0 };

    const somaAnalf = municipios.reduce(
      (acc, m) => acc + (m.taxa_analfabetismo ?? 0), 0
    );
    const somaEscolas = municipios.reduce(
      (acc, m) => acc + (m.qtd_escolas ?? 0), 0
    );

    return {
      analfabetismo: parseFloat((somaAnalf / municipios.length).toFixed(2)),
      escolas: parseFloat((somaEscolas / municipios.length).toFixed(1)),
    };
  }, [municipios]);


  function limparFiltros() {
    setBusca("");
    setFiltroAnalfabetismo("");
    setFiltroEscolas("");
    setMunicipioSelecionado(null);
    setCoordenadasEndereco(null);
  }

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
    <div className="app-container">
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
          busca={busca}
          setBusca={setBusca}
          municipioSelecionado={municipioSelecionado}
          setMunicipioSelecionado={setMunicipioSelecionado}
          limparFiltros={limparFiltros}
          onCoordenadas={setCoordenadasEndereco}
        />

        <main className="main-content">
          <div className="map-container-wrapper">
            <MapContainer
              municipios={municipiosFiltrados}
              municipioSelecionado={municipioSelecionado}
              setMunicipioSelecionado={setMunicipioSelecionado}
              coordenadasEndereco={coordenadasEndereco}
              filtroAnalfabetismo={filtroAnalfabetismo}
              filtroEscolas={filtroEscolas}
            />
          </div>

          <div className="dashboard-panel-footer">
            <DashboardPanel
              municipio={municipioSelecionado}
              setMunicipioSelecionado={setMunicipioSelecionado}
              mediasEstaduais={mediasEstaduais}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;