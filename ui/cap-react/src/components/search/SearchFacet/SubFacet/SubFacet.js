import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import CheckBox from "grommet/components/CheckBox";

const SubFacet = ({ type, field, isAggSelected, selectedAggs, onChange }) => {
  return field[type].buckets.map(nested_field => (
    <Box
      size="medium"
      key={String(nested_field.key)}
      direction="row"
      align="start"
      margin={{ left: "medium" }}
      style={{
        fontSize: "0.8em"
      }}
    >
      <CheckBox
        label={`${nested_field.key} ${
          typeof nested_field.doc_count === "object"
            ? `(${nested_field.doc_count.doc_count})`
            : `(${nested_field.doc_count})`
        }`}
        key={nested_field.key}
        name={String(nested_field.key)}
        checked={
          isAggSelected(
            selectedAggs[type.replace("facet_", "")],
            nested_field.key
          )
            ? true
            : false
        }
        onChange={onChange(type.replace("facet_", ""))}
      />
    </Box>
  ));
};

SubFacet.propTypes = {
  isAggSelected: PropTypes.func,
  onChange: PropTypes.func,
  selectedAggs: PropTypes.object,
  field: PropTypes.object,
  type: PropTypes.string
};

export default SubFacet;
