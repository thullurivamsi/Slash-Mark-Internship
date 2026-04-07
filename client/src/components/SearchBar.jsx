import React, { useState, useRef, useEffect } from "react";

function SearchBar({ onSearch, onDetect, searchResults, showResults, onSelectResult, onDismiss, loading }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        onDismiss();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onDismiss]);

  return (
    <div className="search">
      <form className="search__row" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="search__input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city…"
          autoComplete="off"
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={loading || !query.trim()}>
          Search
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={onDetect}
          disabled={loading}
          title="Detect my location"
        >
          ⊙ Auto
        </button>
      </form>

      {showResults && searchResults.length > 0 && (
        <div className="search__dropdown" ref={dropdownRef}>
          {searchResults.map((r, i) => (
            <button
              key={i}
              className="search__result"
              onClick={() => { onSelectResult(r); setQuery(r.name); }}
            >
              {r.name}
              <div className="search__result-sub">
                {[r.admin1, r.country].filter(Boolean).join(", ")}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;