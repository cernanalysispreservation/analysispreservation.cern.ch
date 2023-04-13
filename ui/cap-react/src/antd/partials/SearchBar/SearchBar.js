import { useState } from "react";
import PropTypes from "prop-types";
import { Input, AutoComplete } from "antd";
import queryString from "query-string";

const SEARCH_PATHS = [
  { label: "Drafts", pathname: "/drafts" },
  {
    label: "Published",
    pathname: "/search"
  }
];

const SearchBar = ({ pushPath }) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");

  const searchResult = query =>
    SEARCH_PATHS.map((item, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        searchOn: item.pathname,
        searchValue: query,
        label: (
          <span>
            Search {query} on{" "}
            <a onClick={() => pushPath(item.searchOn)}>{item.label}</a>
          </span>
        )
      };
    });
  const handleSearch = value => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (_, option) => {
    const { searchValue, searchOn } = option;

    const search_location = {
      pathname: searchOn,
      search: `${queryString.stringify({ q: searchValue })}`
    };
    setValue(searchValue);
    pushPath(search_location);
  };

  return (
    <AutoComplete
      style={{ width: "100%", verticalAlign: "middle" }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      value={value}
      onChange={setValue}
    >
      <Input.Search
        size="large"
        placeholder="Search"
        enterButton
        data-cy="searchbar"
        onSearch={val =>
          onSelect(null, { searchValue: val, searchOn: "/drafts" })
        }
      />
    </AutoComplete>
  );
};

SearchBar.propTypes = {
  pushPath: PropTypes.func
};

export default SearchBar;
