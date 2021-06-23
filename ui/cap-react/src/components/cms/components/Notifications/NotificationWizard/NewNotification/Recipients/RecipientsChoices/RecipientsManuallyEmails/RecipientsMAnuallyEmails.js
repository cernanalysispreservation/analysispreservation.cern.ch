import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import RecipiensList from "../../utils/RecipiensList";
import { Map } from "immutable";

const RecipientsManuallyEmails = ({ emails, updateNotification }) => {
  let index = emails.get("index");
  let mails = emails.get("mails");
  let emailsList = [];
  let defaults =
    mails.has("default") &&
    mails.get("default").map(ml => Map({ type: "default", email: ml }));
  let formatted =
    mails.has("formatted") &&
    mails.get("formatted").map(ml => Map({ type: "formatted", email: ml }));
  if (defaults) emailsList = [...emailsList, ...defaults];
  if (formatted) emailsList = [...emailsList, ...formatted];

  return (
    <Box pad="small">
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
