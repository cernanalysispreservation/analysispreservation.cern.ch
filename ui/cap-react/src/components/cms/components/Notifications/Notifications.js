import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import NotificationBoxes from "./NotificationBoxes/NotificationBoxes";

const Notifications = ({ schemaConfig, pathname }) => {
  const notifications = schemaConfig.getIn(["notifications", "actions"]);

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
        {notifications
          .entrySeq()
          .map((item, index) => (
            <NotificationBoxes
              item={item}
              index={index + 1}
              key={item}
              path={pathname}
            />
          ))}
      </Box>
    </Box>
  );
};

Notifications.propTypes = {
  schemaConfig: PropTypes.object,
  pathname: PropTypes.string
};

export default Notifications;
