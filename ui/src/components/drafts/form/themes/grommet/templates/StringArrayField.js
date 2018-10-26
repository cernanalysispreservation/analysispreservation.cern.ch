import React from "react";
import PropTypes from "prop-types";

import { Button, Box, List, ListItem } from "grommet";

import TextWidget from "../widgets/TextWidget";
import FormTrashIcon from "grommet/components/icons/base/FormTrash";

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
                      <Box flex={true} direction="row">
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
                        <Button
                          onClick={event =>
                            element.onDropIndexClick(element.index)(event)
                          }
                          icon={<FormTrashIcon />}
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
