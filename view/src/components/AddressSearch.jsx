import { useState } from "react";

function AddressSearch() {
  const [endereco, setEndereco] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [erro, setErro] = useState("");

  async function buscarEndereco() {
    try {
      setErro("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          endereco
        )}`
      );

      const data = await response.json();

      if (data.length === 0) {
        setErro("Endereço não encontrado.");
        setCoordenadas(null);
        return;
      }

      setCoordenadas({
        lat: data[0].lat,
        lon: data[0].lon,
      });

      console.log("Coordenadas:", data[0].lat, data[0].lon);
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