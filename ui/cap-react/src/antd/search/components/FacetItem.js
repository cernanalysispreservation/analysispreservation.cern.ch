import PropTypes from "prop-types";
import { Button, Checkbox, Row, Tag } from "antd";
import ShowMore from "../../partials/ShowMore";
import EllipsisText from "../../partials/EllipsisText";
import { Map } from "immutable";

const FacetItem = ({
  item,
  limit,
  category,
  onChange,
  isAggSelected,
  selectedAggs,
}) => {
  return (
    <ShowMore limit={limit} item={item} category={category}>
      {({ current, updateShowMore, filter, expanded, countMore }) => (
        <>
          {current.map(item => (
            <div key={String(item.get("key"))}>
              <Row
                justify="space-between"
                align="top"
                style={{ marginBottom: "10px", wordBreak: "keep-all" }}
              >
                <Checkbox
                  key={item.get("key")}
                  name={String(item.get("key"))}
                  onChange={e => onChange(category, e)}
                  checked={isAggSelected(
                    selectedAggs[category],
                    item.get("key")
                  )}
                >
                  <EllipsisText
                    tooltip
                    length={50}
                    suffixCount={10}
                    type="secondary"
                  >
                    {item.has("__display_name__")
                      ? item.get("__display_name__")
                      : item.get("key")}
                  </EllipsisText>
                </Checkbox>
                <Tag>
                  {Map.isMap(item.get("doc_count"))
                    ? `${item.get("doc_count").get("doc_count")}`
                    : `${item.get("doc_count")}`}
                </Tag>
              </Row>
              {isAggSelected(selectedAggs[category], item.get("key")) &&
                item.keySeq().map((key, index) => {
                  return key.startsWith("facet_") ? (
                    <div key={index + key} style={{ paddingLeft: "10px" }}>
                      {item.getIn([key, "buckets"]).map(nested => (
                        <Row
                          flex
                          key={nested.get("key")}
                          justify="space-between"
                          align="top"
                          style={{
                            marginBottom: "10px",
                            wordBreak: "keep-all",
                          }}
                        >
                          <Checkbox
                            name={String(nested.get("key"))}
                            onChange={e =>
                              onChange(key.replace("facet_", ""), e)
                            }
                            checked={isAggSelected(
                              selectedAggs[key.replace("facet_", "")],
                              nested.get("key")
                            )}
                          >
                            <EllipsisText
                              tooltip
                              length={30}
                              suffixCount={10}
                              type="secondary"
                            >
                              {nested.get("key")}
                            </EllipsisText>
                          </Checkbox>
                          <Tag>
                            {Map.isMap(nested.get("doc_count"))
                              ? `${nested.getIn(["doc_count", "doc_count"])}`
                              : `${nested.get("doc_count")}`}
                          </Tag>
                        </Row>
                      ))}
                    </div>
                  ) : null;
                })}
            </div>
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
        </>
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
  selectedAggs: PropTypes.object,
};

export default FacetItem;
