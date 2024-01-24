import { useState } from "react";
import PropTypes from "prop-types";
import { Input, AutoComplete, Modal } from "antd";
import queryString from "query-string";
import { QuestionCircleOutlined } from "@ant-design/icons";
import HowToSearch from "../HowToSearch";

const { Search } = Input;

const SEARCH_PATHS = [
  { label: "Drafts", pathname: "/drafts" },
  {
    label: "Published",
    pathname: "/search",
  },
];

const SearchBar = ({ pushPath }) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [displayHowToSearch, setDisplayHowToSearch] = useState(false);

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
        ),
      };
    });
  const handleSearch = value => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (_, option) => {
    const { searchValue, searchOn } = option;

    const search_location = {
      pathname: searchOn,
      search: `${queryString.stringify({ q: searchValue })}`,
    };
    setValue(searchValue);
    pushPath(search_location);
  };

  return (
    <div style={{ verticalAlign: "middle" }}>
      <Modal
        open={displayHowToSearch}
        onCancel={() => setDisplayHowToSearch(false)}
        background="#f5f5f5"
        title="How to Search"
        footer={null}
        width={950}
      >
        <HowToSearch />
      </Modal>
      <AutoComplete
        style={{ width: "100%", height: "100%", verticalAlign: "middle" }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        value={value}
        onChange={setValue}
      >
        <Search
          size="large"
          placeholder="Search"
          enterButton
          data-cy="searchbar"
          onSearch={val =>
            onSelect(null, { searchValue: val, searchOn: "/drafts" })
          }
          prefix={
            <QuestionCircleOutlined
              onClick={() => setDisplayHowToSearch(true)}
              style={{ marginRight: "5px" }}
            />
          }
        />
      </AutoComplete>
    </div>
  );
};

SearchBar.propTypes = {
  pushPath: PropTypes.func,
};

export default SearchBar;
