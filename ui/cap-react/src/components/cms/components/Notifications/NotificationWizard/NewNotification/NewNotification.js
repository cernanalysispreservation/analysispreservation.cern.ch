import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Button from "../../../../../partials/Button";
import { AiOutlinePlus } from "react-icons/ai";
import NotificationField from "./NotificationField";
import Recipients from "./Recipients";

const NewNotification = props => {
  return <Recipients />;
  return (
    <Box flex>
      <Box align="center" margin={{ vertical: "large" }}>
        <Heading tag="h3" strong margin="none">
          new notification
        </Heading>
      </Box>
      <Box flex align="center">
        <NotificationField header="Subject" />
        <NotificationField header="Body" />
        <Box size="xxlarge">
          <Heading tag="h3" strong>
            Recipients
          </Heading>
          <Box direction="row" responsive={false} align="center">
            <Button
              text="add parameter"
              icon={<AiOutlinePlus />}
              margin="0 10px 0 0"
            />
            <Box direction="row" wrap align="center">
              <Box>paramer</Box>
              <Box>paramer</Box>
              <Box>paramer</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

NewNotification.propTypes = {};

export default NewNotification;
