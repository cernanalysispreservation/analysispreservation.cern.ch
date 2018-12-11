import React from "react";

import Box from "grommet/components/Box";
import Search from "grommet/components/Search";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import queryString from "query-string";

import Suggestions from "./components/Suggestions";

const INITIAL_STATE = [
  {
    label: <Suggestions text="drafts" />,
    pathname: "/drafts"
  },
  {
    label: <Suggestions text="shared" />,
    pathname: "/search"
  }
];

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.q = queryString.parse(this.props.location.search);
    this.state = {
      suggestions: INITIAL_STATE
    };
  }

  _onSearchSubmit = event => {
    let query = event.target.value;
    let q = queryString.parse(this.props.history.location.search);
    q["q"] = query;
    delete q["page"];

    let index = event.suggestion
      ? event.suggestion.pathname == "/drafts"
        ? "deposits"
        : "records"
      : "records";

    const search_location = {
      pathname: event.suggestion ? event.suggestion.pathname : "/search",
      search: `${queryString.stringify(q)}`,
      from: this.props.match.path,
      index: index
    };

    this.props.history.push(search_location);
  };

  onSearchInput = event => {
    let query = event.target.value;
    let q = queryString.parse(this.props.location.search);
    q["q"] = query;
    this.setState({
      suggestions: [
        {
          label: <Suggestions query={query} text="drafts" />,
          query,
          pathname: "/drafts"
        },
        {
          label: <Suggestions query={query} text="shared" />,
          query,
          pathname: "/search"
        }
      ]
    });
  };

  render() {
    return (
      <Box colorIndex="neutral-1-t">
        <Search
          id="searchbar"
          inline={true}
          placeHolder="Search"
          defaultValue={this.q && this.q["q"]}
          dropAlign={{ top: "bottom" }}
          onDOMChange={this.onSearchInput}
          onSelect={this._onSearchSubmit}
          suggestions={this.state.suggestions}
        />
      </Box>
    );
  }
}

SearchBar.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(SearchBar);
