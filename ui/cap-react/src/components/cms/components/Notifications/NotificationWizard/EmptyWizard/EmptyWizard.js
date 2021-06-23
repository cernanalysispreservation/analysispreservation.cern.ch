import React from "react";
import { Box, Heading, Label, Paragraph } from "grommet";
import NotificationsEmptyIcon from "./NotificationsEmptyIcon";
import Button from "../../../../../partials/Button";

const EmptyWizard = () => {
  return (
    <Box flex>
      <Box align="center" margin={{ vertical: "large" }}>
        <Heading tag="h3" strong margin="none">
          when published
        </Heading>
      </Box>
      <Box flex align="center" margin={{ top: "large" }}>
        <NotificationsEmptyIcon size="xlarge" />
        <Label>Notify your users when a record is published</Label>
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
        />
      </Box>
    </Box>
  );
};

export default EmptyWizard;
