import React from "react";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Search from "grommet/components/Search";
import RevertIcon from "grommet/components/icons/base/Revert";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import queryString from "query-string";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.q = queryString.parse(this.props.location.search);
    this.state = {
      suggestions: []
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

  renderSuggestion(query, text) {
    return (
      <Box direction="row" flex={true} justify="between">
        <Box flex={true} size="small">
          <Label size="small" truncate={true}>
            {query}
          </Label>
        </Box>
        <Box flex={false} colorIndex="grey-3" pad={{ horizontal: "small" }}>
          <Label size="small">
            <RevertIcon size="xsmall" /> Search in {text}
          </Label>
        </Box>
      </Box>
    );
  }

  onSearchInput = event => {
    let query = event.target.value;
    let q = queryString.parse(this.props.location.search);
    q["q"] = query;
    this.setState({ suggestions: [] });
    this.setState({
      suggestions: [
        {
          label: this.renderSuggestion(query, "drafts"),
          query,
          pathname: "/drafts"
        },
        {
          label: this.renderSuggestion(query, "shared"),
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
