import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Notification from "grommet/components/Notification";

export default function ErrorListTemplate(props) {
  const { errors } = props;

  return (
    <Box flex={true}>
      <Notification
        state={null}
        message="Data provided are not correct"
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
