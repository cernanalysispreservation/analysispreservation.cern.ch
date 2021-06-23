import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, Label } from "grommet";
import NotificationField from "../../../../containers/NotificationField";
import Recipients from "./Recipients";

const NewNotification = props => {
  let header = "new notification";

  if (props.location.pathname.endsWith("/edit")) {
    header = "edit notification";
  }

  if (!props.selectedNotification) props.history.push("/notifications");

  let subject = props.selectedNotification.get("subject");
  let body = props.selectedNotification.get("body");
  let recipients = props.selectedNotification.get("recipients");

  return (
    <Box flex>
      <Box align="center" margin={{ vertical: "large" }}>
        <Heading tag="h3" strong margin="none">
          {header}
        </Heading>
      </Box>
      <Box flex align="center">
        <NotificationField
          header="Subject"
          field="subject"
          template={subject.get("template")}
          ctx={subject.get("ctx")}
          updateNotification={(key, val) =>
            props.updateNotificationByIndex(key, val)
          }
        />
        <NotificationField
          header="Body"
          field="body"
          template={body.get("template")}
          ctx={body.get("ctx")}
          updateNotification={(key, val) =>
            props.updateNotificationByIndex(key, val)
          }
        />
        <Box style={{ width: "90%", maxWidth: "992px" }}>
          <Heading tag="h3" strong>
            Recipients
          </Heading>
          <Label size="small">
            first select the type of the email and then configure it
          </Label>
          <Recipients
            recipients={recipients}
            updateNotification={(key, val) =>
              props.updateNotificationByIndex(key, val)
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

NewNotification.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  selectedNotification: PropTypes.object,
  updateNotificationByIndex: PropTypes.func
};

export default NewNotification;
