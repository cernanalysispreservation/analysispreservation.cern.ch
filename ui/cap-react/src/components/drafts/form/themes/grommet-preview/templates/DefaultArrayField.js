import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

class DefaultArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true}>
        <List>
          {this.props.items.map(element => (
            <ListItem
              pad="none"
              margin={{ bottom: "small" }}
              key={element.index}
              separator="none"
            >
              <Box flex={true}>{element.children}</Box>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }
}

DefaultArrayField.propTypes = {
  items: PropTypes.array
};

export default DefaultArrayField;
