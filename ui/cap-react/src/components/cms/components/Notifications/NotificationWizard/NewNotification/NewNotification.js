import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import NotificationField from "../../../../containers/NotificationField";
import Recipients from "./Recipients";
import Button from "../../../../../partials/Button";
import ExpandableBox from "../../../../../partials/ExpandableBox";
import Anchor from "../../../../../partials/Anchor";
import { AiOutlineArrowLeft } from "react-icons/ai";

const NewNotification = props => {
  let header = props.location.pathname.endsWith("/edit")
    ? "edit notification"
    : "new notification";

  // in case there is not notification selected
  // it should be navigated to the main page
  if (!props.selectedNotification) {
    props.updatePath("/admin/cms-analysis/notifications");
    return null;
  }
  let subject = props.selectedNotification.get("subject");
  let body = props.selectedNotification.get("body");
  let recipients = props.selectedNotification.get("recipients");

  return (
    <Box>
      <Box
        pad="small"
        direction="row"
        colorIndex="light-2"
        margin={{ bottom: "medium" }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)"
        }}
      >
        <Box style={{ gridColumn: "1/2" }}>
          <Anchor
            path={
              props.location.pathname.split(
                `/${props.match.params.category}`
              )[0]
            }
          >
            <Button
              text="Notification list"
              icon={<AiOutlineArrowLeft size={16} />}
            />
          </Anchor>
        </Box>
        <Box style={{ gridColumn: "2/4" }} align="center" justify="center">
          <Heading tag="h3" strong margin="none">
            {header}
          </Heading>
        </Box>
      </Box>
      <Box align="center" justify="start">
        <Box size={{ width: "xxlarge" }}>
          <ExpandableBox
            header="General Context"
            label="Provide information regarding the general context"
          >
            <NotificationField
              hideText
              header="Context"
              field="body"
              template={body.get("template")}
              ctx={body.get("ctx")}
              updateNotification={(key, val) =>
                props.updateNotificationByIndex(key, val)
              }
            />
          </ExpandableBox>
          <ExpandableBox
            header="Recipients"
            label="first select the type of the email and then configure it"
          >
            <Recipients
              recipients={recipients}
              updateNotification={(key, val) =>
                props.updateNotificationByIndex(key, val)
              }
            />
          </ExpandableBox>
          <ExpandableBox
            header="Subject"
            label="Address yoru subject requirements"
          >
            <NotificationField
              header="Subject"
              field="subject"
              template={subject.get("template")}
              ctx={subject.get("ctx")}
              updateNotification={(key, val) =>
                props.updateNotificationByIndex(key, val)
              }
            />
          </ExpandableBox>
          <ExpandableBox header="Body" label="Address your body requirements">
            <NotificationField
              header="Body"
              field="body"
              template={body.get("template")}
              ctx={body.get("ctx")}
              updateNotification={(key, val) =>
                props.updateNotificationByIndex(key, val)
              }
            />
          </ExpandableBox>
        </Box>
      </Box>
    </Box>
  );
};

NewNotification.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  selectedNotification: PropTypes.object,
  updateNotificationByIndex: PropTypes.func,
  updatePath: PropTypes.func
};

export default NewNotification;
