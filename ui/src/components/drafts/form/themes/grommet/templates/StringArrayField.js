import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

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
                          options={
                            element.children.props.uiSchema["ui:options"]
                          }
                          value={element.children.props.formData}
                          autofocus="true"
                          pad="none"
                          onKeyDown={event => {
                            if (
                              event.key === "Backspace" &&
                              !element.children.props.formData
                            ) {
                              element.onDropIndexClick(element.index)(event);
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
