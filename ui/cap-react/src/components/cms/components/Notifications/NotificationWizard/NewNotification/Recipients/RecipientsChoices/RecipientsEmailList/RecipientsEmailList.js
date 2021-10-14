import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../../../partials/Tag";
import { getTagType } from "../../../utils/utils";
import { ALL_METHODS } from "../../utils/allowedEmailMethods";

const RecipientsEmailList = ({ emails, updateNotification }) => {
  return (
    <Box pad="medium">
      <Heading tag="h4" margin="none" strong>
        Select emails from list
      </Heading>
      <Box
        direction="row"
        responsive={false}
        wrap
        align="center"
        justify="center"
      >
        {ALL_METHODS.map(title => (
          <Tag
            key={title}
            text={title}
            margin="5px"
            color={getTagType(emails.includes(title))}
            onClick={() => updateNotification({ method: title })}
          />
        ))}
      </Box>
    </Box>
  );
};

RecipientsEmailList.propTypes = {
  updateNotification: PropTypes.func,
  emails: PropTypes.array
};

export default RecipientsEmailList;
