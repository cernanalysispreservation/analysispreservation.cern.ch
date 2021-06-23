import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../partials/Tag";
import RecipientsBox from "./RecipientsBox";
import RecipientsEmailList from "./RecipientsChoices/RecipientsEmailList";
import RecipientsMAnuallyEmails from "./RecipientsChoices/RecipientsManuallyEmails";

const Recipients = props => {
  return (
    <Box flex>
      <Box align="center" margin={{ vertical: "large" }}>
        <Heading tag="h3" strong margin="none">
          add recipients
        </Heading>
      </Box>
      <Box align="center">
        <Heading margin="none" tag="h4">
          Type of email
        </Heading>
        <Box
          direction="row"
          responsive={false}
          margin={{ top: "small", bottom: "large" }}
        >
          <Tag text="bcc" size="large" />
          <Tag text="cc" size="large" margin="0 20px" />
          <Tag text="to" size="large" />
        </Box>
        <RecipientsBox
          header="Select emails from lists"
          label="You can select your emails from a pre defined list"
        >
          <Box margin={{ top: "medium" }}>
            <RecipientsEmailList />
          </Box>
        </RecipientsBox>
        <RecipientsBox
          header="Add email manually"
          label="Create your own list, and add the emails you like to notify"
        >
          <Box margin={{ top: "medium" }}>
            <RecipientsMAnuallyEmails />
          </Box>
        </RecipientsBox>
        <RecipientsBox
          header="Create custom conditions"
          label="Create your own conditions, and define who will be notified"
        />
      </Box>
    </Box>
  );
};

Recipients.propTypes = {};

export default Recipients;
