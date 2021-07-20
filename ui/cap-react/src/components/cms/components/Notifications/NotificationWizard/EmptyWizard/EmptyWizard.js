import React from "react";
import PropTypes from "prop-types";
import { Box, Label, Paragraph } from "grommet";
import NotificationsEmptyIcon from "./NotificationsEmptyIcon";
import Button from "../../../../../partials/Button";

const EmptyWizard = ({ category, createNewNotification }) => {
  return (
    <Box flex align="center">
      <NotificationsEmptyIcon size="xlarge" />
      <Label>Notify your users when a record is {`${category}ed`}</Label>
      <Paragraph>
        <ul>
          <li>add a subject</li>
          <li>add a body</li>
          <li>add recipients</li>
        </ul>
      </Paragraph>
      <Button
        text="Create Notification"
        primary
        margin="0 0 10px 0"
        size="large"
        onClick={() => createNewNotification(category)}
      />
    </Box>
  );
};

EmptyWizard.propTypes = {
  category: PropTypes.string,
  createNewNotification: PropTypes.func
};

export default EmptyWizard;
