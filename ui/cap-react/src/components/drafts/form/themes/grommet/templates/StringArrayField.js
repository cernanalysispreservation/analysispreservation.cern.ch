import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Button from "../../../../../partials/Button";

import { AiOutlineDelete } from "react-icons/ai";

class StringArrayField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} size={{ height: { max: "small" } }}>
        <Box flex={false} margin="none">
          {this.props.items.length > 0 ? (
            this.props.items.map((element, index) => (
              <Box
                flex={false}
                key={index}
                direction="row"
                align="center"
                className={this.props.readonly && "fieldTemplateSeparator"}
              >
                {element.children}

                {!this.props.readonly && (
                  <Button
                    background="#fff"
                    hoverBackground="rgb(238,238,238)"
                    margin="0 5px"
                    size="icon"
                    className="fieldTemplate-delete-btn"
                    onClick={event =>
                      element.onDropIndexClick(element.index)(event)
                    }
                    icon={<AiOutlineDelete size={18} />}
                  />
                )}
              </Box>
            ))
          ) : (
            <Box
              flex
              justify="center"
              align="center"
              pad="small"
              style={{ background: "rgb(216 216 216 / 25%)" }}
            >
              No items
            </Box>
          )}
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
