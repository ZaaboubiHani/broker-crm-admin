import React, { useState } from 'react';
import { FaSearch ,} from 'react-icons/fa'; 
import '../search-bar/search-bar.style.css';

interface SearchBarProps{
    onClick : (searchText: string) => void;
}

const SearchBar :React.FC<SearchBarProps>= ({onClick}) =>{
    const [searchValue, setSearchValue] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = () => {
        onClick(searchValue);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Recherche"
                value={searchValue}
                onChange={handleInputChange}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
                <FaSearch />
            </button>
            <div className="underline"></div>
        </div>
    );
}

export default SearchBar;
