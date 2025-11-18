import { useContext, useState } from 'react';
import './SearchBar.css';
import { ShopContext } from '../contxt/ShopContext';
function Searchbar() {
  const { showSearchbar, setShowSearchbar } = useContext(ShopContext);

  return showSearchbar ? (
    <>
      <div className="searchbar-container">
        <input type="text" className="searchbar" placeholder="SEARCH FOR:" />
        <span onClick={() => setShowSearchbar(false)}>X</span>
      </div>
    </>
  ) : (
    ''
  );
}

export default Searchbar;
