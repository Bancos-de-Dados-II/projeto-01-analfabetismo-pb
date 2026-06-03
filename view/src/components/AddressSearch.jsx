import { useState } from "react";

function AddressSearch({ onCoordenadas }) {
  const [endereco, setEndereco] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [erro, setErro] = useState("");

  async function buscarEndereco() {
    try {
      setErro("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          endereco
        )}&countrycodes=br&viewbox=-39.0, -8.5, -34.5, -6.0&bounded=1`
      );

      const data = await response.json();

      if (data.length === 0) {
        setErro("Endereço não encontrado.");
        setCoordenadas(null);
        return;
      }

      // Convertendo os valores para números flutuantes (float) exigidos pelo Leaflet
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);

      setCoordenadas({
        lat: latitude,
        lon: longitude,
      });

      console.log("Coordenadas:", latitude, longitude);

      if (onCoordenadas) {
        onCoordenadas([latitude, longitude]);
      }

    } catch (error) {
      console.error(error);
      setErro("Erro ao buscar endereço.");
    }
  }

  return (
    <div className="address-search">
      <h3>Buscar Endereço</h3>

      <input
        type="text"
        placeholder="Digite um endereço..."
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
      />

      <button onClick={buscarEndereco}>
        Buscar
      </button>

      {erro && (
        <p className="erro">{erro}</p>
      )}

      {coordenadas && (
        <div className="resultado">
          <p>
            <strong>Latitude:</strong> {coordenadas.lat}
          </p>

          <p>
            <strong>Longitude:</strong> {coordenadas.lon}
          </p>
        </div>
      )}
    </div>
  );
}

export default AddressSearch;