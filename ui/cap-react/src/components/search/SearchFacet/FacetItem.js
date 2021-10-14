import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ShowMore from "../ShowMore";
import CheckBox from "grommet/components/CheckBox";
import Button from "../../partials/Button";
import SubFacet from "./SubFacet/SubFacet";

const getDisplayName = (field) => {
  return field["__display_name__"];
}
const FacetItem = ({
  limit,
  items,
  isAggSelected,
  selectedAggs,
  onChange,
  category
}) => {
  return (
    <ShowMore limit={limit} items={items} category={category}>
      {({ current, updateShowMore, filter, expanded, countMore }) => (
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
                  label={`${"__display_name__" in field ? getDisplayName(field) : field.key } ${
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
                    .map((key, index) => {
                      return (
                        <SubFacet
                          key={key + index}
                          type={key}
                          field={field}
                          isAggSelected={isAggSelected}
                          selectedAggs={selectedAggs}
                          onChange={onChange}
                        />
                      );
                    })}
              </Box>
            </Box>
          ))}
          <Box align="center">
            {filter ? (
              <Button
                size="small"
                background="#e9e9e9"
                margin="0 0 5px 0"
                text={expanded ? "Show less" : `Show ${countMore} more`}
                onClick={() => {
                  updateShowMore(category);
                }}
              />
            ) : null}
          </Box>
        </Box>
      )}
    </ShowMore>
  );
};

FacetItem.propTypes = {
  category: PropTypes.string,
  isAggSelected: PropTypes.func,
  onChange: PropTypes.func,
  selectedAggs: PropTypes.object,
  items: PropTypes.object,
  limit: PropTypes.number
};

export default FacetItem;
