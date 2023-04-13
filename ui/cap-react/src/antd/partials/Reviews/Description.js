import PropTypes from "prop-types";
import { CheckOutlined, DiffOutlined, CloseOutlined } from "@ant-design/icons";
import { Space, Tag, Typography } from "antd";

const Description = ({ review }) => {
  const icon = {
    approved: <CheckOutlined style={{ color: "#52c41a" }} />,
    request_changes: <DiffOutlined style={{ color: "rgb(24, 144, 255)  " }} />,
    declined: <CloseOutlined style={{ color: "#ff4d4f" }} />
  };

  const text = {
    approved: "approved",
    request_changes: "changes requested",
    declined: "declined"
  };
  return (
    <Space direction="horizontal">
      {review.resolved && <Tag color="green">Resolved</Tag>}
      <Typography.Link href={`mailto:${review.reviewer}`}>
        {review.reviewer}
      </Typography.Link>
      <Typography.Text>{icon[review.type]}</Typography.Text>
      <Typography.Text>{text[review.type]}</Typography.Text>
    </Space>
  );
};

Description.propTypes = { review: PropTypes.object };

export default Description;
