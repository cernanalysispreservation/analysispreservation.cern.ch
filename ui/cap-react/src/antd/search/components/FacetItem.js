import React from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Row, Space, Tag } from "antd";
import ShowMore from "../../partials/ShowMore";
import EllipsisText from "../../partials/EllipsisText";

const FacetItem = ({
  items,
  limit,
  category,
  onChange,
  isAggSelected,
  selectedAggs
}) => {
  return (
    <ShowMore limit={limit} items={items} category={category}>
      {({ current, updateShowMore, filter, expanded, countMore }) => (
        <React.Fragment>
          {current.map(item => (
            <React.Fragment key={String(item.key)}>
              <Row justify="space-between" align="top" style={{ marginBottom: "10px", wordBreak: "keep-all"}}>
                <Checkbox
                  key={item.key}
                  name={String(item.key)}
                  onChange={e => onChange(category, e)}
                  checked={isAggSelected(selectedAggs[category], item.key)}
                >
                  <EllipsisText tooltip length={30} suffixCount={10} type="secondary">
                    {"__display_name__" in item
                      ? item["__display_name__"]
                      : item.key}
                  </EllipsisText>
                </Checkbox>
                <Tag>
                  {typeof item.doc_count === "object"
                    ? `${item.doc_count.doc_count}`
                    : `${item.doc_count}`}
                </Tag>
              </Row>
              {isAggSelected(selectedAggs[category], item.key) &&
                Object.keys(item)
                  .filter(key => key.startsWith("facet_"))
                  .map((key, index) => (
                    <div key={index + key} style={{ paddingLeft: "10px" }}>
                      {item[key].buckets.map(nested => (
                        <Row flex key={nested.key} justify="space-between" align="top" style={{ marginBottom: "10px", wordBreak: "keep-all" }}>
                            <Checkbox
                              name={String(nested.key)}
                              onChange={e =>
                                onChange(key.replace("facet_", ""), e)
                              }
                              checked={isAggSelected(
                                selectedAggs[key.replace("facet_", "")],
                                nested.key
                              )}
                            >
                              <EllipsisText tooltip length={30} suffixCount={10} type="secondary">
                                {nested.key}
                              </EllipsisText>
                            </Checkbox>
                            <Tag>
                              {typeof nested.doc_count === "object"
                                ? `${nested.doc_count.doc_count}`
                                : `${nested.doc_count}`}
                            </Tag>
                        </Row>
                      ))}
                    </div>
                  ))}
            </React.Fragment>
          ))}
          {filter && (
            <Button
              size="small"
              onClick={() => {
                updateShowMore(category);
              }}
            >
              {expanded ? "Show less" : `Show ${countMore} more`}
            </Button>
          )}
        </React.Fragment>
      )}
    </ShowMore>
  );
};

FacetItem.propTypes = {
  items: PropTypes.object,
  limit: PropTypes.number,
  category: PropTypes.string,
  onChange: PropTypes.func,
  isAggSelected: PropTypes.func,
  selectedAggs: PropTypes.object
};

export default FacetItem;
