import React from "react";
import PropTypes from "prop-types";
import Tag from "../../Tag";
import Button from "../../Button";
import { Box, Label } from "grommet";
import { AiOutlineCheck, AiOutlineClose, AiOutlineSync } from "react-icons/ai";

const ReviewListItemHeader = ({
  type,
  review = {},
  display = false,
  updateDisplayOptions = null
}) => {
  const _types = {
    approved: "approved",
    request_changes: "changes requested",
    declined: "declined"
  };

  const icon = {
    approved: <AiOutlineCheck color="rgba(69,115,82,0.8)" />,
    request_changes: <AiOutlineSync color="rgba(0,105,150, 0.8)" />,
    declined: <AiOutlineClose color="rgba(179,53,52,0.8)" />
  };

  return (
    <Box
      direction="row"
      responsive={false}
      style={{
        borderBottom: display ? "1px solid #e6e6e6" : null,
        padding: "3px"
      }}
      align="center"
      justify="between"
      onClick={review.resolved ? () => updateDisplayOptions() : null}
    >
      <Box direction="row" align="center">
        <Label size="small" margin="none" style={{ margin: "0 5px 0 0 " }}>
          <a href={`mailto:${review.reviewer}`}>{review.reviewer}</a>
        </Label>
        {review.resolved && (
          <Box align="start">
            <Tag
              text="Resolved"
              size="small"
              color={{
                bgcolor: "#e6ffed",
                border: "#e6ffed",
                color: "#457352"
              }}
            />
          </Box>
        )}
      </Box>
      <Box align="end" direction="row" justify="center">
        <Box align="center" direction="row" justify="center" responsive={false}>
          {icon[type]}
          <Label
            tag="h6"
            size="small"
            margin="none"
            style={{ color: "rgba(0,0,0,0.5)", marginLeft: "5px" }}
            strong
          >
            {_types[type]}
          </Label>
        </Box>
        {review.resolved && (
          <Button
            size="small"
            margin="0 0 0 10px"
            text={display ? "Hide Details" : "Show Details"}
          />
        )}
      </Box>
    </Box>
  );
};

ReviewListItemHeader.propTypes = {
  type: PropTypes.string,
  review: PropTypes.object,
  display: PropTypes.bool,
  updateDisplayOptions: PropTypes.func
};

export default ReviewListItemHeader;
