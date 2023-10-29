import React, { useState, useRef, useEffect } from "react";
import "../styles/SearchBox.css";

function SearchBox({ data, value, onChange, onShopSelected }) {
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showDropdown, setShowDropdown] = useState(false);

    const ref = useRef(null);

    // Sample data for suggestions

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setActiveIndex(-1);
        setShowDropdown(true);
    };

    const handleSuggestionClick = (suggestion) => {
        console.log('Clicked suggestion:', suggestion.nodeId);
        setQuery(suggestion.name);
        setActiveIndex(-1);
        handleShopSelection(suggestion.nodeId);
        if (onChange) {
            onChange(suggestion); // Update the parent's state
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" && activeIndex < filteredData.length - 1) {
            setActiveIndex((prevIndex) => prevIndex + 1);
        } else if (e.key === "ArrowUp" && activeIndex > 0) {
            setActiveIndex((prevIndex) => prevIndex - 1);
        } else if (e.key === "Enter" && activeIndex !== -1) {
            setQuery(filteredData[activeIndex].name);

            handleShopSelection(filteredData[activeIndex].id);
        }
    };

    // useEffect(() => {
    //   const handleClickOutside = (event) => {
    //     if (ref.current && !ref.current.contains(event.target)) {
    //       setQuery(""); // close suggestions
    //     }
    //   };

    //   document.addEventListener("mousedown", handleClickOutside);
    //   return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   };
    // }, []);


    const handleShopSelection = (shopId) => {
        // Call the provided onShopSelected prop function with the selected shop's ID.
        onShopSelected(shopId);
        console.log("shop selected", shopId)
        // Clear the search box
        //setQuery("");
        setShowDropdown(false);
        // Reset active index
        setActiveIndex(-1);
    };


    useEffect(() => {
        // This will set the query to the name of the current location (if it's set)
        if (value) {
            setQuery(value.name);
        }
    }, [value]);

    return (
        <div className="navbar-searchbox-container" ref={ref}>
            <input
                type="text"
                placeholder="Select a Shop"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="navbar-searchbox-input"
            />
            
            {showDropdown && (
                <ul className="navbar-searchbox-dropdown">
                    {filteredData.map((suggestion, index) => (
                        <li
                            key={suggestion.nodeId}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={index === activeIndex ? "active" : ""}
                        >
                            {suggestion.name}
                            <span className="align-right">({suggestion.floor} floor)</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBox;