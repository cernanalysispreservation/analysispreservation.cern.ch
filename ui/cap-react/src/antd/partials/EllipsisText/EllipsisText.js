import { Tooltip } from "antd";
import PropTypes from "prop-types";

const EllipsisText = ({
  children,
  length,
  middle,
  suffixCount = 10,
  tooltip,
  ...other
}) => {
  let text = children;
  if (typeof text !== "string") {
    throw new Error("Ellipsis children must be string.");
  }
  if (text.length <= length || length < 0) {
    return <span {...other}>{text}</span>;
  }
  const tail = "...";
  let displayText;
  if (length - tail.length <= 0) {
    displayText = "";
  } else if (middle) {
    const start = text.slice(0, length - suffixCount - tail.length).trim();
    const suffix = text.slice(-suffixCount).trim();
    displayText = `${start}${tail}${suffix}`;
  } else {
    displayText = text.slice(0, length - tail.length);
    displayText = `${displayText}${tail}`;
  }

  if (tooltip) {
    return <Tooltip title={text}>{displayText}</Tooltip>;
  }

  return displayText;
};

EllipsisText.propTypes = {
  children: PropTypes.node,
  length: PropTypes.number,
  middle: PropTypes.bool,
  tooltip: PropTypes.bool,
  suffixCount: PropTypes.number
};

export default EllipsisText;
