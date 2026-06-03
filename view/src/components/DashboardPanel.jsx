import GraphContainer from "./GraphContainer";

function DashboardPanel({ municipio, setMunicipioSelecionado, mediasEstaduais }) {
  return (
    <section className="dashboard-panel">
      <div className="card">
        <h3>Taxa de Analfabetismo</h3>
        <GraphContainer
          title="Taxa de Analfabetismo"
          municipioSelecionado={municipio}
          setMunicipioSelecionado={setMunicipioSelecionado}
          valorMunicipio={municipio?.taxa_analfabetismo ?? null}
          mediaEstadual={mediasEstaduais.analfabetismo}
          unidade="%"
        />
      </div>

      <div className="card">
        <h3>Quantidade de Escolas</h3>
        <GraphContainer
          title="Quantidade de Escolas"
          municipioSelecionado={municipio}
          setMunicipioSelecionado={setMunicipioSelecionado}
          valorMunicipio={municipio?.qtd_escolas ?? null}
          mediaEstadual={mediasEstaduais.escolas}
          unidade="escolas"
        />
      </div>
    </section>
  );
}

export default DashboardPanel;