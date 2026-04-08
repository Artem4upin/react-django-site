import Search from "../Search/Search";
import SearchDropdown from "../Header/SearchDropdown/SearchDropdown";
import {IProduct} from "../../types/product";
import './SearchContainer.scss'

interface NavigationProps {
    searchResult: IProduct[];
    setSearchResult: (searchResult: IProduct[]) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isDropdownOpen: boolean) => void;
    setHasSearching: (hasSearching: boolean) => void;
    hasSearching: boolean;

}

function SearchContainer({
                        searchResult,
                        setSearchResult,
                        setIsDropdownOpen,
                        setHasSearching,
                        hasSearching,
                        isDropdownOpen,
    }: NavigationProps) {
    return (
        <div className="search-container">
            <div className='search-container__search-wrapper'>
                <Search
                    searchResult={searchResult}
                    setSearchResult={setSearchResult}
                    setIsDropdownOpen={setIsDropdownOpen}
                    setHasSearching={setHasSearching}
                    hasSearching={hasSearching}
                />
                <SearchDropdown
                    results={searchResult}
                    setResults={setSearchResult}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    hasSearching={hasSearching}
                />
            </div>
        </div>
    )
}

export default SearchContainer;