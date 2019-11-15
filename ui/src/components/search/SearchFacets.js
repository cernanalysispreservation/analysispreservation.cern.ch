import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import queryString from "query-string";

import Heading from "grommet/components/Heading";
import Sidebar from "grommet/components/Sidebar";
import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";
import CheckBox from "grommet/components/CheckBox";

// import FiltersPreview from './components/FiltersPreview';

class SearchFacets extends React.Component {
  constructor(props) {
    super(props);
  }

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

    this.updateHistory(_selectedAggregations);
  }

  updateHistory(selectedAggs) {
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

  render() {
    if (this.props.aggs) {
      let constructFacets = function(aggs) {
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
            obj = constructFacets(aggs[key]);
          }
          Object.assign(facets, obj);
        }

        return facets;
      };

      let facets = constructFacets(this.props.aggs);
      let categories = Object.keys(facets);

      return (
        <Sidebar full={false} colorIndex="light-2">
          <Box flex={true} justify="start">
            <Menu flex={true} primary={true}>
              {categories.map(category => {
                return (
                  <Box key={category}>
                    {facets[category].buckets.length > 0 && (
                      <Box pad="small" key={category}>
                        <Heading
                          pad="small"
                          tag="h5"
                          strong={false}
                          uppercase={true}
                          truncate={true}
                          href="#"
                          className="active"
                          label={category}
                          id={category}
                          value={category}
                        >
                          {category.replace("_", " ")}
                        </Heading>
                        <Box
                          styles={{ maxHeight: "100px" }}
                          pad="none"
                          direction="column"
                        >
                          {facets[category].buckets.map(field => (
                            <Box key={String(field.key)}>
                              <Box
                                responsive={false}
                                pad={{ horizontal: "small" }}
                                direction="row"
                                justify="between"
                                align="center"
                                style={{ fontSize: "0.8em" }}
                              >
                                <CheckBox
                                  label={field.key}
                                  id={field.key}
                                  key={field.key}
                                  name={String(field.key)}
                                  checked={
                                    this.isAggSelected(
                                      this.props.selectedAggs[category],
                                      field.key
                                    )
                                      ? true
                                      : false
                                  }
                                  onChange={this._onChange.bind(this, category)}
                                />
                                <Box align="end">
                                  {typeof field.doc_count === "object"
                                    ? field.doc_count.doc_count
                                    : field.doc_count}
                                </Box>
                              </Box>
                              <Box margin={{ left: "small" }}>
                                {this.isAggSelected(
                                  this.props.selectedAggs[category],
                                  field.key
                                ) &&
                                  Object.keys(field)
                                    .filter(key => key.startsWith("facet_"))
                                    .map(key => {
                                      return field[key].buckets.map(
                                        nested_field => (
                                          <Box
                                            size="medium"
                                            key={String(nested_field.key)}
                                            direction="row"
                                            justify="between"
                                            align="left"
                                            style={{ fontSize: "0.8em" }}
                                          >
                                            <CheckBox
                                              label={nested_field.key}
                                              key={nested_field.key}
                                              name={String(nested_field.key)}
                                              checked={
                                                this.isAggSelected(
                                                  this.props.selectedAggs[
                                                    key.replace("facet_", "")
                                                  ],
                                                  nested_field.key
                                                )
                                                  ? true
                                                  : false
                                              }
                                              onChange={this._onChange.bind(
                                                this,
                                                key.replace("facet_", "")
                                              )}
                                            />
                                            <Box align="end">
                                              {typeof nested_field.doc_count ===
                                              "object"
                                                ? nested_field.doc_count
                                                    .doc_count
                                                : nested_field.doc_count}
                                            </Box>
                                          </Box>
                                        )
                                      );
                                    })}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Menu>
          </Box>
        </Sidebar>
      );
    }

    return <div>None</div>;
  }
}

SearchFacets.propTypes = {
  aggs: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  selectedAggs: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    selectedAggs: state.search.getIn(["selectedAggs"])
  };
}

export default withRouter(connect(mapStateToProps)(SearchFacets));
