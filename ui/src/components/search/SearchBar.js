import React from "react";

import Box from "grommet/components/Box";
import Search from "grommet/components/Search";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import queryString from "query-string";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.q = queryString.parse(this.props.location.search);
  }

  _onSearchSubmit(event) {
    let query = event.target.value;
    let q = queryString.parse(this.props.history.location.search);
    q["q"] = query;
    delete q["page"];

    const search_location = {
      pathname: `/search`,
      search: `${queryString.stringify(q)}`,
      from: this.props.match.path
    };

    this.props.history.push(search_location);
  }

  onSearchInput = event => {
    let query = event.target.value;
    let q = queryString.parse(this.props.location.search);
    q["q"] = query;
  };

  render() {
    return (
      <Box colorIndex="neutral-1-t">
        <Search
          id="searchbar"
          inline={true}
          placeHolder="Search"
          defaultValue={this.q && this.q["q"]}
          dropAlign={{ right: "right" }}
          onDOMChange={this.onSearchInput}
          onSelect={this._onSearchSubmit.bind(this)}
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
