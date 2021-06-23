import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import { AiOutlineSwapRight } from "react-icons/ai";
import Button from "../../../../partials/Button";
import Anchor from "../../../../partials/Anchor";

const NotificationBoxes = ({ title, index, description }) => {
  return (
    <Box style={{ backgroundColor: "#f5f5f5" }} pad="small">
      <Box justify="between" direction="row" responsive={false}>
        <Heading margin="none" tag="h4" strong>
          {title}
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
      <Box margin={{ vertical: "small" }}>{description}</Box>
      <Box direction="row" responsive={false} justify="between">
        <Box>
          notifications <span>0</span>
        </Box>
        <Anchor>
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
  title: PropTypes.string,
  index: PropTypes.number
};

export default NotificationBoxes;
