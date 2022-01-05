import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Heading from "grommet/components/Heading";

import Box from "grommet/components/Box";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";

import { updateCollapsableFacetArray } from "../../../actions/search";

import SearchSlider from "../SearchSlider";
import FacetItem from "./FacetItem";

const SearchFacet = ({
  category,
  isAggSelected,
  selectedAggs,
  onChange,
  collapsed,
  updateFacet,
  facet
}) => {
  let expanded = !collapsed.includes(category);

  const getContentByMetaType = type => {
    const choices = {
      true: <SearchSlider item={facet.get(category)} category={category} />,
      false: (
        <FacetItem
          limit={11}
          item={facet.getIn([category, "buckets"])}
          isAggSelected={isAggSelected}
          selectedAggs={selectedAggs}
          onChange={onChange}
          category={category}
        />
      )
    };

    return choices[type === "range"];
  };

  return (
    <Box>
      <Box
        direction="row"
        align="center"
        justify="between"
        responsive={false}
        margin={{ top: "medium", bottom: "small" }}
        onClick={() => updateFacet(category)}
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
          {facet.hasIn([category, "meta", "title"])
            ? facet.getIn([category, "meta", "title"])
            : category.replace("_", " ")}
        </Heading>

        <Box>{expanded ? <AiOutlineUp /> : <AiOutlineDown />}</Box>
      </Box>

      <Box size="medium" styles={{ maxHeight: "100px" }} direction="column">
        {expanded &&
          getContentByMetaType(
            facet.hasIn([category, "meta", "type"]) &&
              facet.getIn([category, "meta", "type"])
          )}
      </Box>
    </Box>
  );
};

SearchFacet.propTypes = {
  category: PropTypes.string,
  facet: PropTypes.object,
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
