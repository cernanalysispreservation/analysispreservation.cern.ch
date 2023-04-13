import PropTypes from "prop-types";
import { Tag, Empty, Typography, Space, Row } from "antd";

const CollectionPermissionItem = ({ permissions, title }) => {
  return (
    <Row>
      <Typography.Title level="5">{title}</Typography.Title>
      <Space style={{ flexWrap: "wrap" }}>
        {permissions && permissions.size > 0 ? (
          permissions.map((item, index) => <Tag key={item + index}>{item}</Tag>)
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="  There are no egroups/users email addresses provided for this
          category"
          />
        )}
      </Space>
    </Row>
  );
};

CollectionPermissionItem.propTypes = {
  permissions: PropTypes.array,
  title: PropTypes.string,
};

export default CollectionPermissionItem;
