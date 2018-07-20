import React from "react";
import PropTypes from "prop-types";

import { Box, List, ListItem } from "grommet";

import TextWidget from "../widgets/TextWidget";

class StringArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{ height: { max: "small" } }}>
        {this.props.items.length > 0 && (
          <Box margin={{ top: "small", bottom: "medium" }}>
            <List>
              {this.props.items.length > 0
                ? this.props.items.map(element => (
                    <ListItem key={element.index} separator="none" pad="none">
                      <Box flex={true}>
                        <TextWidget
                          {...element.children.props}
                          value={element.children.props.formData}
                          autofocus="true"
                          pad="none"
                          onKeyDown={event => {
                            if (
                              event.key === "Backspace" &&
                              !element.children.props.formData
                            ) {
                              element.onDropIndexClick(element.index)(event);
                            } else if (event.key === "Enter") {
                              this.props.onAddClick(event);
                            }
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))
                : null}
            </List>
          </Box>
        )}
      </Box>
    );
  }
}

StringArrayField.propTypes = {
  items: PropTypes.array,
  onAddClick: PropTypes.func
};

export default StringArrayField;
