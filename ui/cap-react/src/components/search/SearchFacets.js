import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import queryString from "query-string";

import Heading from "grommet/components/Heading";
import Sidebar from "grommet/components/Sidebar";
import Box from "grommet/components/Box";
import SearchFacetLoading from "./SearchFacetLoading";
import CheckBox from "grommet/components/CheckBox";

import SearchFacet from "./SearchFacet";

// import FiltersPreview from './components/FiltersPreview';

class SearchFacets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: "",
      categoryScope: this.props.location.pathname,
      yours: "by_me" in queryString.parse(this.props.location.search),
      expanded: true
    };
  }

  constructFacets = aggs => {
    let facets = {};

    let keys = Object.keys(aggs).filter(key => {
      return typeof aggs[key] === "object";
    });
    for (let key of keys) {
      let obj = {};
      if (key.startsWith("facet_")) {
        obj[key.replace("facet_", "")] =
          "filtered" in aggs[key] ? aggs[key]["filtered"] : aggs[key];
      } else {
        obj = this.constructFacets(aggs[key]);
      }
      Object.assign(facets, obj);
    }

    return facets;
  };

  _onChange(category, event) {
    const name = event.target ? event.target.name : null;
    let currentParams = queryString.parse(this.props.location.search);

    this._toggleAggs(category, name, currentParams);
  }

  _toggleAggs(category, name, selectedAggregations) {
    let _selectedAggregations = Object.assign({}, selectedAggregations);

    if (!_selectedAggregations[category]) {
      _selectedAggregations[category] = [];
    }

    if (typeof _selectedAggregations[category] == "string")
      _selectedAggregations[category] = [_selectedAggregations[category]];

    let index = _selectedAggregations[category].indexOf(name);

    if (index == -1) _selectedAggregations[category].push(name);
    else _selectedAggregations[category].splice(index, 1);

    this.updateHistory(_selectedAggregations, category);
  }

  updateHistory(selectedAggs, category) {
    let facet = this.constructFacets(this.props.aggs);
    let catType;
    if (facet[category]) {
      let temp = Object.keys(facet[category].buckets[0]).filter(name =>
        name.startsWith("facet_")
      );
      temp.length ? (catType = temp[0].replace("facet_", "")) : null;
    }

    // remove nested filters if the parent is unchecked
    let eligibleItems = [];

    if (facet[category] && facet[category].buckets) {
      selectedAggs[category].map(item => {
        facet[category].buckets.map(bucket => {
          if (item === bucket.key) {
            let bucketListName = Object.keys(bucket).filter(b =>
              b.startsWith("facet_")
            );
            if (bucket[bucketListName[0]]) {
              bucket[bucketListName[0]].buckets.map(bucket_item =>
                eligibleItems.push(bucket_item.key)
              );
            }
          }
        });
      });

      let intersect = [];

      if (selectedAggs[catType]) {
        intersect = eligibleItems.filter(item =>
          selectedAggs[catType].includes(item)
        );
        selectedAggs[catType] = intersect;
      }
    }

    let currentParams = queryString.parse(this.props.location.search);
    "page" in selectedAggs ? delete selectedAggs["page"] : null;
    "page" in currentParams ? delete currentParams["page"] : null;

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, selectedAggs)
      )}`
    };

    this.props.history.replace(location);
  }

  isAggSelected(selected, value) {
    if (selected) {
      if (selected.constructor === Array) {
        return selected.indexOf(value) > -1;
      } else {
        return selected === value;
      }
    }

    return false;
  }

  _filter_by_yours = () => {
    let currentParams = queryString.parse(this.props.location.search);

    if ("by_me" in currentParams) {
      delete currentParams["by_me"];
      this.setState({ yours: false });
    } else {
      currentParams["by_me"] = "True";
      this.setState({ yours: true });
    }

    this.props.history.replace({
      search: `${queryString.stringify(currentParams)}`
    });
  };

  updateCategory = () => {
    let location = this.props.location;

    let anatype = this.props.match.params.anatype;

    location.pathname = location.pathname.startsWith("/search")
      ? "/drafts"
      : "/search";
    this.setState({ categoryScope: location.pathname });

    // if the anatype exists means that the user needs a specific type of analysis
    // in the event that the user wants to search through the drafts, the type should be maintained
    if (anatype) {
      let currentParams = queryString.parse(this.props.location.search);
      currentParams["type"] = anatype;
      location = {
        search: queryString.stringify(currentParams)
      };
    }

    this.props.history.push(location);
  };

  render() {
    let facets_result = null;

    if (this.props.aggs) {
      let facets = this.constructFacets(this.props.aggs);

      if (this.props.removeType) {
        delete facets.type;
      }
      let categories = Object.keys(facets);

      facets_result = (
        <Box
          flex={false}
          primary={true}
          margin={{ vertical: "medium" }}
          className="search_facets"
        >
          {categories.map(category => {
            return (
              <Box key={category}>
                {facets[category].buckets.length > 0 && (
                  <Box key={category} separator="bottom">
                    <SearchFacet
                      category={category}
                      facets={facets}
                      isAggSelected={this.isAggSelected}
                      selectedAggs={this.props.selectedAggs}
                      onChange={category => this._onChange.bind(this, category)}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    return (
      <Sidebar full={false} colorIndex="light-2">
        <Box flex={false} justify="start" pad="medium">
          <Box justify="end">
            <Box direction="row" align="end" responsive={false}>
              <Heading tag="h3" margin="none">
                Filters
              </Heading>
            </Box>
            <Box
              direction="row"
              align="center"
              margin={{ vertical: "small" }}
              responsive={false}
            >
              <span className="grommetux-check-box__label">Drafts</span>
              <CheckBox
                label="Published"
                toggle={true}
                reverse={false}
                onChange={this.updateCategory}
                checked={this.state.categoryScope.startsWith("/search")}
              />
            </Box>
            <Box
              direction="row"
              responsive={false}
              align="center"
              margin={{ vertical: "small" }}
            >
              <span className="grommetux-check-box__label">Yours</span>
              <CheckBox
                label="All"
                toggle={true}
                reverse={false}
                onChange={this._filter_by_yours}
                checked={!this.state.yours}
              />
            </Box>
          </Box>
          {this.props.loading ? <SearchFacetLoading /> : facets_result}
        </Box>
      </Sidebar>
    );
  }
}

SearchFacets.propTypes = {
  aggs: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  selectedAggs: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  removeType: PropTypes.string,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    selectedAggs: state.search.getIn(["selectedAggs"]),
    loading: state.search.getIn(["loading"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchFacets));
