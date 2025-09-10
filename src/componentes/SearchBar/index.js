import React from "react";
import './estilo.css';

function SearchBar({ placeholder, onSearch }) {
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
}

export default SearchBar;
