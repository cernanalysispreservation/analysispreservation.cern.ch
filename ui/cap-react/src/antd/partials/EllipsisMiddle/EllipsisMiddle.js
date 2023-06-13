import PropTypes from "prop-types";
import { Typography } from "antd";

const EllipsisMiddle = ({ suffixCount, children, copyable }) => {
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Typography.Text
      style={{ maxWidth: "100%" }}
      ellipsis={{ suffix }}
      copyable={copyable}
    >
      {start}
    </Typography.Text>
  );
};

EllipsisMiddle.propTypes = {
  copyable: PropTypes.bool,
  children: PropTypes.string,
  suffixCount: PropTypes.number,
};

export default EllipsisMiddle;
