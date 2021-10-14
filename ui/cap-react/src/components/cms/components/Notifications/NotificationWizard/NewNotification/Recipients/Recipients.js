import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../partials/Tag";
import RecipientsEmailList from "./RecipientsChoices/RecipientsEmailList";
import RecipientsManuallyEmails from "./RecipientsChoices/RecipientsManuallyEmails";
import RecipientsCustomConditions from "../../../../../containers/RecipientsCustomConditions";
import { Map } from "immutable";
import { getTagType } from "../utils/utils";
import { getEmailList } from "./utils/utils";

const Recipients = ({ recipients, updateNotification }) => {
  const [emailType, setEmailType] = useState("bcc");

  let currentRecipients = recipients.get(emailType);
  let { simpleEmailList, checkEmailList, methodEmailList } = getEmailList(
    currentRecipients
  );

  return (
    <Box>
      <Box align="center" justify="center">
        <Heading margin="none" tag="h4">
          Type of email
        </Heading>
        <Box
          direction="row"
          responsive={false}
          margin={{ top: "small", bottom: "large" }}
        >
          <Tag
            text="bcc"
            size="large"
            onClick={() => setEmailType("bcc")}
            color={getTagType(emailType == "bcc")}
          />
          <Tag
            text="cc"
            size="large"
            margin="0 20px"
            onClick={() => setEmailType("cc")}
            color={getTagType(emailType == "cc")}
          />
          <Tag
            text="to"
            size="large"
            onClick={() => setEmailType("to")}
            color={getTagType(emailType == "to")}
          />
        </Box>
      </Box>
      {emailType && (
        <React.Fragment>
          <Box margin={{ vertical: "medium" }} colorIndex="light-2">
            <RecipientsEmailList
              emails={methodEmailList}
              updateNotification={val =>
                updateNotification(["recipients", emailType], Map(val))
              }
            />
          </Box>
          <Box margin={{ bottom: "medium" }} colorIndex="light-2">
            <RecipientsManuallyEmails
              emails={simpleEmailList}
              updateNotification={(key, val) =>
                updateNotification(["recipients", emailType, ...key], val)
              }
            />
          </Box>

          <Box margin={{ bottom: "medium" }} colorIndex="light-2">
            <RecipientsCustomConditions
              emailType={emailType}
              emails={checkEmailList}
              updateNotification={(key, val) =>
                updateNotification(["recipients", emailType, ...key], val)
              }
            />
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

Recipients.propTypes = {
  updateNotification: PropTypes.func,
  recipients: PropTypes.object
};

export default Recipients;
