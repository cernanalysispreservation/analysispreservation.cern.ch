import React, { useState } from "react";
import PropTypes from "prop-types";
import Truncate from "react-truncate";

const ShowMoreText = ({
  children,
  more = "Show More",
  less = "Show less",
  lines = 5
}) => {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);

  const handleTruncate = isTruncated => {
    if (truncated !== isTruncated) {
      setTruncated(truncated);
    }
  };

  const toggleLines = event => {
    event.preventDefault();

    setExpanded(!expanded);
  };
  return (
    <div>
      <Truncate
        lines={!expanded && lines}
        ellipsis={
          <div>
            . . .{" "}
            <a href="#" onClick={toggleLines}>
              {more}
            </a>
          </div>
        }
        onTruncate={handleTruncate}
      >
        {children}
      </Truncate>
      {!truncated &&
        expanded && (
          <div>
            <a href="#" onClick={toggleLines}>
              {less}
            </a>
          </div>
        )}
    </div>
  );
};

ShowMoreText.propTypes = {
  children: PropTypes.node.isRequired,
  more: PropTypes.string,
  less: PropTypes.string,
  lines: PropTypes.number
};

export default ShowMoreText;
