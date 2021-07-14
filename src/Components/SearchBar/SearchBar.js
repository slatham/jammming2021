import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const search = () => {
    onSearch(searchTerm);
  };

  const handleTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="SearchBar">
      <input
        onChange={handleTermChange}
        placeholder="Enter A Song, Album, or Artist"
      />
      <button onClick={search} className="SearchButton">
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
