import React from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { Button, Row, Select, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const SORT_OPTIONS = [
  { value: "mostrecent", label: "Most Recent" },
  { value: "bestmatch", label: "Best Match" }
];

const getValueFromLocation = (value = "mostrecent") => {
  const choices = {
    mostrecent: "Most Recent",
    bestmatch: "Best Match"
  };

  return choices[value];
};

const Header = ({
  location,
  results,
  onChange,
  shouldDisplayFacetButton,
  updateDisplayFacet
}) => {
  const total = results.getIn(["hits", "total"]) || 0;

  return (
    <Row style={{ marginBottom: "10px" }} justify="space-between">
      {queryString.parse(location.search).q ? (
        <Typography.Title level={5}>
          {total > 1 ? `${total} Results for ` : `${total} Result for `}
          <Typography.Text italic>
            {queryString.parse(location.search).q}
          </Typography.Text>
        </Typography.Title>
      ) : (
        <Typography.Title level={5}>
          {total > 1 ? `${total} Results ` : `${total} Result `}
        </Typography.Title>
      )}
      <Space>
        {shouldDisplayFacetButton && (
          <Button icon={<FilterOutlined />} onClick={updateDisplayFacet}>
            Filters
          </Button>
        )}
        {total > 0 && (
          <Select
            defaultValue={
              queryString.parse(location.search).sort || "mostrecent"
            }
            style={{ width: 120 }}
            onChange={onChange}
          >
            {SORT_OPTIONS.map(item => (
              <Select.Option value={item.value} key={item.value}>
                {getValueFromLocation(item.value)}
              </Select.Option>
            ))}
          </Select>
        )}
      </Space>
    </Row>
  );
};

Header.propTypes = {
  location: PropTypes.object,
  results: PropTypes.object,
  onChange: PropTypes.func,
  shouldDisplayFacetButton: PropTypes.bool,
  updateDisplayFacet: PropTypes.func
};

export default Header;
