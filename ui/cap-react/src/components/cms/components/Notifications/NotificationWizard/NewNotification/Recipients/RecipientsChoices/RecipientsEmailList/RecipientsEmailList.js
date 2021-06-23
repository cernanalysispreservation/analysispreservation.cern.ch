import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Tag from "../../../../../../../../partials/Tag";

const all_methods = ["get_owner", "get_submitter", "get_cms_stat_recipients"];

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

const RecipientsEmailList = ({ emails, updateNotification }) => {
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
        {all_methods.map(title => (
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
