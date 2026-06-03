import AddressSearch from "./AddressSearch";

function Sidebar({
  municipios,
  filtroAnalfabetismo,
  setFiltroAnalfabetismo,
  filtroEscolas,
  setFiltroEscolas,
  busca,
  setBusca,
  municipioSelecionado,
  setMunicipioSelecionado,
  limparFiltros,
}) {
  function handleSelecionar(municipio) {
    if (municipioSelecionado?.code_muni === municipio.code_muni) {
      setMunicipioSelecionado(null);
    } else {
      setMunicipioSelecionado(municipio);
    }
  }

  // Lógica de ativação do botão 'Limpar Filtro'
  const temFiltroAtivo =
    busca !== "" ||
    filtroAnalfabetismo !== "" ||
    filtroEscolas !== "" ||
    municipioSelecionado !== null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Filtros</h2>
        <button
          onClick={limparFiltros}
          disabled={!temFiltroAtivo}
          className="btn-limpar"
        >
          Limpar
        </button>
      </div>

      <label>Taxa de analfabetismo</label>
      <select
        value={filtroAnalfabetismo}
        onChange={(e) => setFiltroAnalfabetismo(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="0-5">0% a 5%</option>
        <option value="5-10">5% a 10%</option>
        <option value="10-15">10% a 15%</option>
        <option value="15+">15%+</option>
      </select>

      <label>Quantidade de escolas</label>
      <select
        value={filtroEscolas}
        onChange={(e) => setFiltroEscolas(e.target.value)}
      >
        <option value="">Todas</option>
        <option value="0-20">0 a 20</option>
        <option value="20-50">20 a 50</option>
        <option value="50+">50+</option>
      </select>

      <AddressSearch />

      <label>Buscar município</label>
      <input
        type="text"
        placeholder="Digite o nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="municipios-list">
        <h3>Municípios ({municipios.length})</h3>
        <ul>
          {municipios.map((municipio) => {
            const selecionado =
              municipioSelecionado?.code_muni === municipio.code_muni;

            return (
              <li
                key={municipio.code_muni}
                onClick={() => handleSelecionar(municipio)}
                className={`municipio-item${selecionado ? " ativo" : ""}`}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSelecionar(municipio)
                }
              >
                <strong>{municipio.nome_municipio}</strong>
                <br />
                Analfabetismo: {municipio.taxa_analfabetismo}%
                <br />
                Escolas: {municipio.qtd_escolas}
              </li>
            );
          })}

          {municipios.length === 0 && (
            <li className="municipio-vazio">Nenhum município encontrado.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;