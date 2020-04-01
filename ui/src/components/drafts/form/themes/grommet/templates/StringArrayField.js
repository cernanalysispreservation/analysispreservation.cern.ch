import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import FormTrashIcon from "grommet/components/icons/base/FormTrash";
import ErrorFieldIndicator from "./ErrorFieldIndicator";

class StringArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size={{ height: { max: "small" } }}>
        {this.props.items.length > 0 && (
          <Box flex={true} margin={{ top: "small", bottom: "medium" }}>
            <List>
              {this.props.items.length > 0
                ? this.props.items.map(element => (
                    <ListItem key={element.index} separator="none" pad="none">
                      <ErrorFieldIndicator
                        errors={this.props.formContext.ref}
                        id={element.children.props.idSchema.$id}
                        hideIndicator
                      >
                        <Box flex={true} direction="row">
                          {element.children}

                          {!this.props.readonly && (
                            <Button
                              onClick={event =>
                                element.onDropIndexClick(element.index)(event)
                              }
                              icon={<FormTrashIcon />}
                            />
                          )}
                        </Box>
                      </ErrorFieldIndicator>
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
  onAddClick: PropTypes.func,
  readonly: PropTypes.bool,
  formContext: PropTypes.object
};

export default StringArrayField;
