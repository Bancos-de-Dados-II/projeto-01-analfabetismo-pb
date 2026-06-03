import { useEffect, useState } from "react";
import { MapContainer as LeafletMap, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PARAIBA_CENTER = [-7.12, -36.72];
const PARAIBA_ZOOM = 8;

// MODIFICADO INÍCIO: centro calculado direto da geometria — sem L.geoJSON() que deixa camada fantasma no DOM
function calcularCentro(geometry) {
  const coords = [];

  function extrairCoordenadas(arr, profundidade) {
    if (profundidade === 0) {
      coords.push(arr);
    } else {
      arr.forEach((item) => extrairCoordenadas(item, profundidade - 1));
    }
  }

  if (geometry.type === "Polygon") {
    extrairCoordenadas(geometry.coordinates[0], 1);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((poligono) =>
      extrairCoordenadas(poligono[0], 1)
    );
  }

  if (coords.length === 0) return null;

  const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
  return [lat, lon];
}

function FocarMunicipio({ municipioSelecionado, geoJsonData }) {
  const map = useMap();

  useEffect(() => {
    if (!municipioSelecionado) {
      map.setView(PARAIBA_CENTER, PARAIBA_ZOOM, { animate: true });
      return;
    }

    if (!geoJsonData) return;

    const feature = geoJsonData.features.find(
      (f) => f.properties.code_muni === municipioSelecionado.code_muni
    );

    if (!feature) {
      console.warn("FocarMunicipio: feature não encontrada para", municipioSelecionado.nome_municipio);
      return;
    }

    const centro = calcularCentro(feature.geometry);
    if (!centro) return;

    map.setView(centro, 11, { animate: true });
  }, [municipioSelecionado, geoJsonData, map]);

  return null;
}
// MODIFICADO FIM

// MODIFICADO INÍCIO: botão de geolocalização via navigator.geolocation
function BotaoGeolocalizacao() {
  const map = useMap();

  function handleGeolocalizacao() {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const { latitude, longitude } = posicao.coords;
        map.setView([latitude, longitude], 13, { animate: true });
      },
      () => {
        alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
      }
    );
  }

  return (
    <button
      onClick={handleGeolocalizacao}
      className="btn-geolocalizacao"
      title="Centralizar na minha localização"
    >
      📍
    </button>
  );
}
// MODIFICADO FIM

// MODIFICADO INÍCIO: escala de cores coroplética por taxa_analfabetismo
function obterCor(taxa) {
  if (taxa === undefined || taxa === null) return "#cccccc"; // sem dado → cinza
  if (taxa < 5) return "#1a9850"; // verde escuro  — muito baixo
  if (taxa < 10) return "#91cf60"; // verde claro   — baixo
  if (taxa < 15) return "#fee08b"; // amarelo       — intermediário
  if (taxa < 20) return "#fc8d59"; // laranja       — alto
  return "#d73027";        // vermelho      — muito alto (20%+)
}
// MODIFICADO FIM

function MapContainer({ municipioSelecionado, setMunicipioSelecionado }) {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca em paralelo: geometrias locais + dados tabulares da API
        const [resGeo, resDados] = await Promise.all([
          // MODIFICADO: trocado arquivo estático pela rota real do backend
          fetch("http://localhost:3000/municipios"), // GeoJSON com geometrias
          fetch("http://localhost:3000/dados"),      // tabular com taxa e escolas
        ]);

        const geo = await resGeo.json();
        const dados = await resDados.json();

        // Índice dos dados tabulares por code_muni para cruzamento O(1)
        const indiceDados = Object.fromEntries(
          dados.map((d) => [d.code_muni, d])
        );

        // Injeta taxa_analfabetismo e qtd_escolas nas properties de cada feature
        const geoCruzado = {
          ...geo,
          features: geo.features.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              ...(indiceDados[feature.properties.code_muni] ?? {}),
            },
          })),
        };

        setGeoJsonData(geoCruzado);
      } catch (error) {
        console.error("Erro ao carregar dados do mapa:", error);
      }
    }

    carregarDados();
  }, []);

  // MODIFICADO INÍCIO: borda contínua escura no selecionado — sem tracejado azul
  function estiloPadrao(feature) {
    const selecionado =
      municipioSelecionado &&
      feature.properties.code_muni === municipioSelecionado.code_muni;

    const cor = obterCor(feature.properties.taxa_analfabetismo);

    return {
      color: selecionado ? "#222" : "#333",
      weight: selecionado ? 3 : 0.8,
      dashArray: null,
      fillColor: cor,
      fillOpacity: 0.7,
    };
  }
  // MODIFICADO FIM

  // MODIFICADO INÍCIO: tooltip rico unificado — remove popup e tooltip simples anteriores
  function aoClicarFeature(feature, layer) {
    const { nome_municipio, taxa_analfabetismo, qtd_escolas } = feature.properties;

    layer.on("click", () => {
      setMunicipioSelecionado(feature.properties);
    });

    layer.bindTooltip(`
      <div style="min-width:160px; font-family:Arial,sans-serif; font-size:13px; line-height:1.6">
        <strong style="font-size:14px; display:block; margin-bottom:6px">
          ${nome_municipio ?? "—"}
        </strong>
        <span style="color:#555">📚 Analfabetismo:</span>
        <strong style="float:right">${taxa_analfabetismo != null ? taxa_analfabetismo + "%" : "—"}</strong>
        <br/>
        <span style="color:#555">🏫 Escolas:</span>
        <strong style="float:right">${qtd_escolas != null ? qtd_escolas : "—"}</strong>
      </div>
    `, {
      sticky: true,
      direction: "top",
      opacity: 1,
    });
  }
  // MODIFICADO FIM

  return (
    <div className="map-placeholder">
      <LeafletMap
        center={PARAIBA_CENTER}
        zoom={PARAIBA_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MODIFICADO: botão de geolocalização adicionado dentro do mapa */}
        <BotaoGeolocalizacao />

        <FocarMunicipio
          municipioSelecionado={municipioSelecionado}
          geoJsonData={geoJsonData}
        />

        {geoJsonData && (
          <GeoJSON
            key={municipioSelecionado?.code_muni ?? "geojson"}
            data={geoJsonData}
            style={estiloPadrao}
            onEachFeature={aoClicarFeature}
          />
        )}
      </LeafletMap>
    </div>
  );
}

export default MapContainer;