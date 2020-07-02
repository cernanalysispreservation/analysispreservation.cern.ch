import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Button from "../../../../../partials/Button";

import FormTrashIcon from "grommet/components/icons/base/FormTrash";

class StringArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} size={{ height: { max: "small" } }}>
        <Box flex={false} margin={{ top: "small", bottom: "medium" }}>
          {this.props.items.length > 0
            ? this.props.items.map((element, index) => (
                <Box flex={false} key={index} direction="row">
                  {element.children}

                  {!this.props.readonly && (
                    <Button
                      background="#fff"
                      onClick={event =>
                        element.onDropIndexClick(element.index)(event)
                      }
                      icon={<FormTrashIcon />}
                    />
                  )}
                </Box>
              ))
            : null}
        </Box>
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
