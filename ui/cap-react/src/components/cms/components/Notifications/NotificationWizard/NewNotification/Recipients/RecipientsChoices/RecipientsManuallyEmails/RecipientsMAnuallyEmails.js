import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, Label } from "grommet";
import RecipiensList from "../../utils/RecipiensList";
import { fromJS } from "immutable";

const RecipientsManuallyEmails = ({ emails, updateNotification }) => {
  let index = emails.get("index");
  let mails = emails.get("mails");
  let emailsList = [];
  let defaults =
    mails.has("default") &&
    mails.get("default").map(ml => fromJS({ type: "default", email: ml }));
  let formatted =
    mails.has("formatted") &&
    mails.get("formatted").map(ml => fromJS({ type: "formatted", email: ml }));
  if (defaults) emailsList = [...emailsList, ...defaults];
  if (formatted) emailsList = [...emailsList, ...formatted];

  return (
    <Box pad="medium">
      <Heading tag="h4" margin="none" strong>
        Add email manually
      </Heading>
      <Label size="small" margin="none">
        Create your own list, and add the emails you like to notify
      </Label>
      <RecipiensList
        emailsList={emailsList}
        updateList={(key, val) => updateNotification([index, ...key], val)}
      />
    </Box>
  );
};

RecipientsManuallyEmails.propTypes = {
  emails: PropTypes.object,
  updateNotification: PropTypes.func
};

export default RecipientsManuallyEmails;
