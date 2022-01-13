import React from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Row, Space, Tag } from "antd";
import ShowMore from "../../partials/ShowMore";

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
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Checkbox
                  key={item.key}
                  name={String(item.key)}
                  onChange={e => onChange(category, e)}
                  checked={isAggSelected(selectedAggs[category], item.key)}
                >
                  {"__display_name__" in item
                    ? item["__display_name__"]
                    : item.key}
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
                        <Row key={nested.key} style={{ marginBottom: "10px" }}>
                          <Space>
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
                              {nested.key}
                            </Checkbox>
                            <Tag>
                              {typeof nested.doc_count === "object"
                                ? `${nested.doc_count.doc_count}`
                                : `${nested.doc_count}`}
                            </Tag>
                          </Space>
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
