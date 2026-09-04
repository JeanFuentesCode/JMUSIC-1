import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar canción, artista..."
          aria-label="Buscar canción"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;