import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import Button from "grommet/components/Button";
import ListItem from "grommet/components/ListItem";

import FormTrashIcon from "grommet/components/icons/base/FormTrash";

import ArrayUtils from "../components/ArrayUtils";

class DefaultArrayField extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Box margin="none" size={{ height: { max: "small" } }}>
        {this.props.items.length > 0 && (
          <Box margin={{ top: "small", bottom: "medium" }}>
            <List>
              {this.props.items.length > 0
                ? this.props.items.map(element => (
                    <ListItem key={element.index} separator="none" pad="none">
                      <Box flex={true}>{element.children}</Box>
                      {!this.props.readonly && (
                        <Button
                          onClick={event =>
                            element.onDropIndexClick(element.index)(event)
                          }
                          icon={<FormTrashIcon />}
                        />
                      )}
                      {this.props.options &&
                      this.props.options.enableArrayUtils ? (
                        <ArrayUtils
                          hasRemove={element.hasRemove}
                          hasMoveDown={element.hasMoveDown}
                          hasMoveUp={element.hasMoveUp}
                          onDropIndexClick={element.onDropIndexClick}
                          onReorderClick={element.onReorderClick}
                          index={element.index}
                        />
                      ) : null}
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

DefaultArrayField.propTypes = {
  items: PropTypes.array,
  options: PropTypes.object
};

export default DefaultArrayField;
