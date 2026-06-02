import SearchBar from "./SearchBar";

function Header({ busca, setBusca }) {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Analfabetismo na Paraíba</h2>
      </div>

      <SearchBar
        busca={busca}
        setBusca={setBusca}
      />
    </header>
  );
}

export default Header;