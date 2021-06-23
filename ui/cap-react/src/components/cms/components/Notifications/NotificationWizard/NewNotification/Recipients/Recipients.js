import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../partials/Tag";
import RecipientsBox from "./RecipientsBox";
import RecipientsEmailList from "./RecipientsChoices/RecipientsEmailList";
import RecipientsManuallyEmails from "./RecipientsChoices/RecipientsManuallyEmails";
import RecipientsCustomConditions from "../../../../../containers/RecipientsCustomConditions";
import { Map, fromJS } from "immutable";

const Recipients = ({ recipients, updateNotification }) => {
  const [emailType, setEmailType] = useState(undefined);

  const getTagType = isTagSelected => {
    const choices = {
      true: {
        bgcolor: "#e6f7ff",
        border: "rgba(0, 106, 147, 1)",
        color: "rgba(0, 106, 147, 1)"
      },
      false: {
        bgcolor: "#fafafa",
        border: "#d9d9d9",
        color: "rgba(0,0,0,0.65)"
      }
    };

    return choices[isTagSelected];
  };

  let currentRecipients = recipients.get(emailType);

  // group the different cases of email lists
  let simpleEmailList = fromJS({
    mails: {
      default: [],
      formatted: []
    },
    index: ""
  });
  let methodEmailList = [];
  let checkEmailList = [];
  currentRecipients &&
    currentRecipients.map((item, index) => {
      if (item.has("checks")) checkEmailList.push({ index, mail: item });
      else if (item.has("method")) methodEmailList.push(item.get("method"));
      else if (item.has("mails"))
        simpleEmailList = Map({ index, mails: item.get("mails") });
    });

  const calculateSimpleEmailListCount = emails => {
    let df = emails.get("default");
    let fm = emails.get("formatted");
    let sum = 0;

    sum += df ? df.size : 0;
    sum += fm ? fm.size : 0;
    return sum;
  };

  return (
    <Box flex>
      <Box align="center">
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
        {emailType && (
          <React.Fragment>
            <RecipientsBox
              header="Create custom conditions"
              label="Create your own conditions, and define who will be notified"
              count={checkEmailList.length}
            >
              <Box margin={{ top: "medium" }}>
                <RecipientsCustomConditions
                  emailType={emailType}
                  emails={checkEmailList}
                  updateNotification={(key, val) =>
                    updateNotification(["recipients", emailType, ...key], val)
                  }
                />
              </Box>
            </RecipientsBox>
            <RecipientsBox
              header="Add email manually"
              label="Create your own list, and add the emails you like to notify"
              count={calculateSimpleEmailListCount(
                simpleEmailList.get("mails")
              )}
            >
              <Box margin={{ top: "medium" }}>
                <RecipientsManuallyEmails
                  emails={simpleEmailList}
                  updateNotification={(key, val) =>
                    updateNotification(["recipients", emailType, ...key], val)
                  }
                />
              </Box>
            </RecipientsBox>
            <RecipientsBox
              header="Select emails from lists"
              label="You can select your emails from a pre defined list"
              count={methodEmailList.length}
            >
              <Box margin={{ top: "medium" }}>
                <RecipientsEmailList
                  emails={methodEmailList}
                  updateNotification={val =>
                    updateNotification(["recipients", emailType], Map(val))
                  }
                />
              </Box>
            </RecipientsBox>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

Recipients.propTypes = {
  updateNotification: PropTypes.func,
  recipients: PropTypes.object
};

export default Recipients;
