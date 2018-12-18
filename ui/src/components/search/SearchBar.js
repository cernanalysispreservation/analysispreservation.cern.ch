import React from "react";

import Search from "grommet/components/Search";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import queryString from "query-string";

import Suggestions from "./components/Suggestions";

const SEARCH_PATHS = ["/search", "/drafts"];

const DEFAULT_SEARCH_PATH = "/search";

const INITIAL_STATE = [
  {
    label: <Suggestions text="drafts" />,
    pathname: "/drafts"
  },
  {
    label: <Suggestions text="published" />,
    pathname: "/search"
  }
];

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: INITIAL_STATE,
      value: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.updateSearchInput(this.props.history.location.search);
    }
  }

  updateSearchInput = location => {
    let q = queryString.parse(location)["q"];
    this.setState({
      suggestions: [
        {
          label: <Suggestions query={q} text="drafts" />,
          q,
          pathname: "/drafts"
        },
        {
          label: <Suggestions query={q} text="published" />,
          q,
          pathname: "/search"
        }
      ],
      value: q
    });
  };

  onSearchSubmit = (event, selected) => {
    let pathname;
    let q = queryString.parse(this.props.history.location.search);
    let query = event.target.value;

    q["q"] = query;

    delete q["page"];

    if (selected) {
      pathname = event.suggestion.pathname; // if suggestion picked, redirect to corresponding search page
    } else if (SEARCH_PATHS.includes(this.props.location.pathname)) {
      pathname = this.props.location.pathname; // if query typed on the search page, keep path
    } else {
      pathname = DEFAULT_SEARCH_PATH; // if query typed on non search page, redirect to the default one
    }

    const search_location = {
      pathname: pathname,
      search: `${queryString.stringify(q)}`,
      from: this.props.match.path
    };

    this.props.history.push(search_location);
  };

  onSearchInput = event => {
    let q = queryString.parse(this.props.location.search);
    let query = event.target.value;

    q["q"] = query;

    this.setState({
      suggestions: [
        {
          label: <Suggestions query={query} text="drafts" />,
          query,
          pathname: "/drafts"
        },
        {
          label: <Suggestions query={query} text="published" />,
          query,
          pathname: "/search"
        }
      ],
      value: query
    });
  };

  render() {
    return (
      <Search
        id="searchbar"
        inline={true}
        placeHolder="Search"
        dropAlign={{ top: "bottom" }}
        onDOMChange={this.onSearchInput}
        onSelect={this.onSearchSubmit}
        suggestions={this.state.suggestions}
        value={this.state.value}
      />
    );
  }
}

SearchBar.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(SearchBar);
