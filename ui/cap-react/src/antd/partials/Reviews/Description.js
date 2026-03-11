import PropTypes from "prop-types";
import {
  CheckOutlined,
  DiffOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Space, Tag, Tooltip, Typography } from "antd";

const formatDate = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.toLocaleString();
};

const typeConfig = {
  approved: {
    icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    label: "approved",
    color: "green",
  },
  request_changes: {
    icon: <DiffOutlined style={{ color: "#1890ff" }} />,
    label: "changes requested",
    color: "blue",
  },
  declined: {
    icon: <CloseOutlined style={{ color: "#ff4d4f" }} />,
    label: "declined",
    color: "red",
  },
};

const Description = ({ review }) => {
  const config = typeConfig[review.type] || {};

  return (
    <Space direction="vertical" size={2} style={{ width: "100%" }}>
      <Space size={[6, 4]} wrap>
        <Tag
          color={config.color}
          icon={config.icon}
          style={{ marginRight: 0 }}
        >
          {config.label}
        </Tag>
        {review.resolved && (
          <Tooltip
            title={
              review.resolved_by
                ? `Resolved by ${review.resolved_by}${review.resolved_at ? ` on ${formatDate(review.resolved_at)}` : ""}`
                : undefined
            }
          >
            <Tag color="success">Resolved</Tag>
          </Tooltip>
        )}
      </Space>
      <Space size={4}>
        <Typography.Link
          href={`mailto:${review.reviewer}`}
          style={{ fontSize: 13 }}
        >
          {review.reviewer}
        </Typography.Link>
        {review.created_at && (
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            <ClockCircleOutlined style={{ marginRight: 3 }} />
            {formatDate(review.created_at)}
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
};

Description.propTypes = { review: PropTypes.object };

export default Description;
