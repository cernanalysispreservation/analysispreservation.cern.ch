import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Heading from "grommet/components/Heading";
import CheckBox from "grommet/components/CheckBox";
import Anchor from "../../partials/Anchor";
import Box from "grommet/components/Box";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import ShowMore from "../ShowMore";

import { updateCollapsableFacetArray } from "../../../actions/search";

const SearchFacet = ({
  category,
  facets,
  isAggSelected,
  selectedAggs,
  onChange,
  collapsed,
  updateFacet
}) => {
  let expanded = !collapsed.toJS().includes(category);
  let facet = facets[category]
  return (
    <Box>
      <Box
        direction="row"
        align="center"
        justify="between"
        responsive={false}
        margin={{ top: "medium", bottom: "small" }}
      >
        <Heading
          pad="small"
          tag="h5"
          margin="none"
          strong={true}
          uppercase={true}
          truncate={true}
          href="#"
          className="active"
          label={category}
          id={category}
          value={category}
        >
          {facet.meta && facet.meta.title ? facet.meta.title : category.replace("_", " ")}
        </Heading>

        <Box onClick={() => updateFacet(category)}>
          {expanded ? <AiOutlineUp /> : <AiOutlineDown />}
        </Box>
      </Box>
      <Box size="medium" styles={{ maxHeight: "100px" }} direction="column">
        {expanded ? (
          <ShowMore limit={11} items={facets[category].buckets}>
            {({ current, showMore, showLess, filter, expanded }) => (
              <Box>
                {current.map(field => (
                  <Box key={String(field.key)}>
                    <Box
                      size="medium"
                      direction="row"
                      align="center"
                      style={{
                        fontSize: "0.8em"
                      }}
                    >
                      <CheckBox
                        label={`${field.key} ${
                          typeof field.doc_count === "object"
                            ? `(${field.doc_count.doc_count})`
                            : `(${field.doc_count})`
                        }`}
                        key={field.key}
                        name={String(field.key)}
                        checked={
                          isAggSelected(selectedAggs[category], field.key)
                            ? true
                            : false
                        }
                        onChange={onChange(category)}
                      />
                    </Box>
                    <Box
                      style={{
                        margin: "5px 0"
                      }}
                      margin={{
                        left: "small"
                      }}
                    >
                      {isAggSelected(selectedAggs[category], field.key) &&
                        Object.keys(field)
                          .filter(key => key.startsWith("facet_"))
                          .map(key => {
                            return field[key].buckets.map(nested_field => (
                              <Box
                                size="medium"
                                key={String(nested_field.key)}
                                direction="row"
                                align="start"
                                style={{
                                  fontSize: "0.8em"
                                }}
                              >
                                <CheckBox
                                  id="search_checkbox"
                                  label={nested_field.key}
                                  key={nested_field.key}
                                  name={String(nested_field.key)}
                                  checked={
                                    isAggSelected(
                                      selectedAggs[key.replace("facet_", "")],
                                      nested_field.key
                                    )
                                      ? true
                                      : false
                                  }
                                  onChange={onChange(key.replace("facet_", ""))}
                                />
                                <Box align="end">
                                  {typeof nested_field.doc_count === "object"
                                    ? nested_field.doc_count.doc_count
                                    : nested_field.doc_count}
                                </Box>
                              </Box>
                            ));
                          })}
                    </Box>
                  </Box>
                ))}
                <Box align="center">
                  {filter ? (
                    <Anchor
                      label={expanded ? "less" : "more"}
                      onClick={() => {
                        expanded ? showLess() : showMore();
                      }}
                    />
                  ) : null}
                </Box>
              </Box>
            )}
          </ShowMore>
        ) : null}
      </Box>
    </Box>
  );
};

SearchFacet.propTypes = {
  category: PropTypes.string,
  facets: PropTypes.object,
  isAggSelected: PropTypes.func,
  onChange: PropTypes.func,
  collapsed: PropTypes.array,
  updateFacet: PropTypes.func,
  selectedAggs: PropTypes.object
};

const mapStateToProps = state => ({
  collapsed: state.search.get("collapsed")
});

const mapDispatchToProps = dispatch => ({
  updateFacet: val => dispatch(updateCollapsableFacetArray(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFacet);
