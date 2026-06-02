function SearchBar({ busca, setBusca }) {
  return (
    <input
      type="text"
      placeholder="Buscar município..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
    />
  );
}

export default SearchBar;