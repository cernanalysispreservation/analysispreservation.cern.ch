import PropTypes from "prop-types";
import { Space, Tag } from "antd";

const Tags = ({
  onClick,
  params = undefined,
  clearFilter,
  anatype,
  removeAnatype,
}) => {
  if (!params) return null;

  // keep in track if the query exists
  const queryExists = params["q"];

  // remove params that are not meant to be displayed for the tags
  delete params["sort"];
  delete params["page"];
  delete params["size"];
  delete params["by_me"];
  delete params["q"];
  const clearAllFilters = Object.keys(params).length > 0 || queryExists;

  return (
    <Space style={{ marginBottom: "10px", flexWrap: "wrap" }}>
      {anatype && (
        <Tag color="geekblue" closable onClose={removeAnatype}>
          {anatype}
        </Tag>
      )}
      {Object.entries(params) &&
        Object.entries(params).map(
          item =>
            Array.isArray(item[1]) ? (
              item[1].map(nested => (
                <Tag
                  key={nested}
                  color="geekblue"
                  closable
                  onClose={() => onClick(item[0], nested)}
                >
                  {item[0]}-{decodeURIComponent(nested)}
                </Tag>
              ))
            ) : (
              <Tag
                key={item}
                closable
                color="geekblue"
                onClose={() => onClick(item[0], item[1])}
              >
                {item[0]}-{decodeURIComponent(item[1])}
              </Tag>
            )
        )}
      {clearAllFilters && (
        <Tag closable onClose={clearFilter}>
          Clear All Filters
        </Tag>
      )}
    </Space>
  );
};

Tags.propTypes = {
  onClick: PropTypes.func,
  params: PropTypes.object,
  clearFilter: PropTypes.func,
  anatype: PropTypes.string,
  removeAnatype: PropTypes.func,
};

export default Tags;
