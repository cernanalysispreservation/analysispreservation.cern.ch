import React from "react";
import PropTypes from "prop-types";

import { Box, List, ListItem } from "grommet";

class DefaultArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{ height: { max: "small" } }}>
        <List>
          {this.props.items.length > 0 ? (
            this.props.items.map(element => (
              <ListItem
                key={element.index}
                separator="none"
                margin="none"
                pad="none"
              >
                <Box flex={true}>{element.children}</Box>
              </ListItem>
            ))
          ) : (
            <Box colorIndex="light-2" pad="small" margin={{ top: "small" }}>
              No {this.props.title} provided.
            </Box>
          )}
        </List>
      </Box>
    );
  }
}

DefaultArrayField.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string
};

export default DefaultArrayField;
