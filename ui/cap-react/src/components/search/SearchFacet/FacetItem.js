import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ShowMore from "../ShowMore";
import CheckBox from "grommet/components/CheckBox";
import Anchor from "../../partials/Anchor";

const FacetItem = ({
  limit,
  items,
  isAggSelected,
  selectedAggs,
  onChange,
  category
}) => {
  return (
    <ShowMore limit={limit} items={items}>
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
