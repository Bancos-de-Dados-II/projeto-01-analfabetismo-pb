import AddressSearch from "./AddressSearch";

function Sidebar({
  municipios,
  filtroAnalfabetismo,
  setFiltroAnalfabetismo,
  filtroEscolas,
  setFiltroEscolas
}) {
  return (
    <aside className="sidebar">
      <h2>Filtros</h2>

      <label>Taxa de analfabetismo</label>

      <select
        value={filtroAnalfabetismo}
        onChange={(e) =>
          setFiltroAnalfabetismo(e.target.value)
        }
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
        onChange={(e) =>
          setFiltroEscolas(e.target.value)
        }
      >
        <option value="">Todas</option>
        <option value="0-20">0 a 20</option>
        <option value="20-50">20 a 50</option>
        <option value="50+">50+</option>
      </select>
      
      <AddressSearch />
      <div className="municipios-list">
        <h3>Municípios</h3>

        <ul>
          {municipios.map((municipio) => (
            <li key={municipio.code_muni}>
              <strong>{municipio.nome_municipio}</strong>

              <br />
                Analfabetismo: {municipio.taxa_analfabetismo}%
              <br />

              Escolas: {municipio.qtd_escolas}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;