import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

function GraphContainer({
  title,
  municipioSelecionado,
  valorMunicipio,
  mediaEstadual,
  unidade = "",
}) {
  // Estado vazio: nenhum município selecionado
  if (valorMunicipio === null || valorMunicipio === undefined) {
    return (
      <div className="graph-vazio">
        <p>Selecione um município para visualizar os dados.</p>
      </div>
    );
  }

  const dados = [
    {
      nome: municipioSelecionado?.nome_municipio ?? "Município",
      valor: valorMunicipio,
    },
    {
      nome: "Média Estadual",
      valor: mediaEstadual,
    },
  ];

  // Município acima da média estadual → vermelho; abaixo → verde
  const acimaDaMedia = valorMunicipio > mediaEstadual;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={dados}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="nome"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}${unidade}`}
        />

        <Tooltip
          formatter={(value) => [`${value}${unidade}`, title]}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />

        {/* Linha de referência da média estadual */}
        <ReferenceLine
          y={mediaEstadual}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          label={{
            value: `Média: ${mediaEstadual}${unidade}`,
            position: "insideTopRight",
            fontSize: 11,
            fill: "#f59e0b",
          }}
        />

        <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
          {dados.map((entry, index) => (
            <Cell
              key={index}
              fill={
                index === 0
                  ? acimaDaMedia ? "#ef4444" : "#22c55e"  // município: vermelho ou verde
                  : "#94a3b8"                              // média estadual: cinza neutro
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraphContainer;