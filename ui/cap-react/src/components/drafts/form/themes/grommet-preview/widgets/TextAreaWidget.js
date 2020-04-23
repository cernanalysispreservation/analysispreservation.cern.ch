import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

class TextAreaWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box
        pad={{ horizontal: "medium" }}
        style={{ overflow: "hidden" }}
        size={{ width: "xxlarge" }}
        justify="center"
        flex={false}
        alignSelf="end"
      >
        {this.props.value || ""}
      </Box>
    );
  }
}

TextAreaWidget.propTypes = {
  value: PropTypes.string,
  options: PropTypes.object
};

export default TextAreaWidget;
