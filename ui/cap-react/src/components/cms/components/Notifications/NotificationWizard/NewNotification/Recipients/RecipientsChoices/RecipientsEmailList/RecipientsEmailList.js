import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../../../partials/Tag";

const RecipientsEmailList = props => {
  return (
    <Box align="center">
      <Heading tag="h4">Select the emails you want to include </Heading>
      <Box
        direction="row"
        responsive={false}
        wrap
        align="center"
        justify="center"
      >
        <Tag text="owner of analysis" margin="5px" />
        <Tag text="submitter of analysis" margin="5px" />
        <Tag
          text="Stats Questionnaire Contacts (by working group)"
          margin="5px"
        />
      </Box>
    </Box>
  );
};

RecipientsEmailList.propTypes = {};

export default RecipientsEmailList;
