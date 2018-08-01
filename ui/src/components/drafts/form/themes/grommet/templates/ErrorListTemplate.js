import React from "react";
import PropTypes from "prop-types";

import { Box, Notification, List, ListItem } from "grommet";

export default function ErrorListTemplate(props) {
  const { errors } = props;

  return (
    <Box flex={true}>
      <Notification
        state={null}
        message="Please correct the marked fields below."
        timestamp={null}
        status="critical"
        closer={true}
      />
      <Box colorIndex="light-2">
        <List flex="true">
          {errors.map((error, i) => {
            return (
              <ListItem key={i}>
                <Box flex={true}>{error.stack}</Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}

ErrorListTemplate.propTypes = {
  errors: PropTypes.object
};
