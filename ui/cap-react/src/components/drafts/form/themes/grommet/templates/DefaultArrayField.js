import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import ArrayUtils from "../components/ArrayUtils";
import ErrorFieldIndicator from "./ErrorFieldIndicator";

class DefaultArrayField extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Box margin="none" size={{ height: { max: "small" } }}>
        {this.props.items.length > 0 && (
          <Box flex={true} margin={{ top: "small", bottom: "medium" }}>
            <List>
              {this.props.items.length > 0
                ? this.props.items.map(element => (
                    <ListItem key={element.index} separator="none" pad="none">
                      <Box flex={true} margin={{ bottom: "small" }}>
                        <ErrorFieldIndicator
                          errors={this.props.formContext.ref}
                          id={element.children.props.idSchema.$id}
                          hideIndicator
                        >
                          {element.children}
                        </ErrorFieldIndicator>
                      </Box>
                      {!this.props.readonly && (
                        <ArrayUtils
                          propId={this.props.idSchema.$id}
                          hasRemove={element.hasRemove}
                          hasMoveDown={element.hasMoveDown}
                          hasMoveUp={element.hasMoveUp}
                          onDropIndexClick={element.onDropIndexClick}
                          onReorderClick={element.onReorderClick}
                          index={element.index}
                        />
                      )}
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
  options: PropTypes.object,
  readonly: PropTypes.bool,
  formContext: PropTypes.object
};

export default DefaultArrayField;
