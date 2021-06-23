import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import { AiOutlineSwapRight } from "react-icons/ai";
import Button from "../../../../partials/Button";
import Anchor from "../../../../partials/Anchor";

const getDescription = desc => {
  const choices = {
    publish:
      "Send an email notification to users when a publish event takes place",
    review:
      "Send an email notification to users when a review event takes place"
  };

  return choices[desc];
};

const NotificationBoxes = ({ item, index }) => {
  return (
    <Box style={{ backgroundColor: "#f5f5f5" }} pad="small">
      <Box justify="between" direction="row" responsive={false}>
        <Heading margin="none" tag="h4" strong>
          {item[0]}
        </Heading>
        <Heading
          margin="none"
          tag="h5"
          strong
          style={{ color: "rgba(0,0,0,0.5)" }}
        >
          #{index}
        </Heading>
      </Box>
      <Box margin={{ vertical: "small" }}>{getDescription(item[0])}</Box>
      <Box direction="row" responsive={false} justify="between">
        <Box>
          notifications <span>{item[1].size}</span>
        </Box>
        <Anchor path={`/notifications/${item[0]}`}>
          <Button
            text="See more"
            primaryOutline
            icon={<AiOutlineSwapRight />}
            reverse
          />
        </Anchor>
      </Box>
    </Box>
  );
};

NotificationBoxes.propTypes = {
  item: PropTypes.array,
  index: PropTypes.number,
  description: PropTypes.string
};

export default NotificationBoxes;
