import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import NotificationBoxes from "./NotificationBoxes/NotificationBoxes";
const nots = [
  {
    title: "publish",
    description:
      "Send an email notification to users when a publish event takes place"
  },
  {
    title: "review",
    description:
      "Send an email notification to users when a review event takes place"
  }
];
const Notifications = props => {
  return (
    <Box flex>
      <Box margin={{ vertical: "medium" }} align="center">
        <Heading tag="h3">Notification Configuration</Heading>
      </Box>
      <Box
        style={{
          display: "grid",
          gridGap: "3rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px, 350px))",
          justifyContent: "center"
        }}
      >
        {nots.map((item, index) => (
          <NotificationBoxes {...item} index={index + 1} key={item.title} />
        ))}
      </Box>
    </Box>
  );
};

Notifications.propTypes = {};

export default Notifications;
