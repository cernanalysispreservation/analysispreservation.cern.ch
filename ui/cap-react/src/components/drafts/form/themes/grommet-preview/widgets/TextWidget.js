import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import { connect } from "react-redux";
import { formDataChange } from "../../../../../../actions/draftItem";

class TextWidget extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Box
        style={{ overflow: "hidden", wordBreak: "break-all" }}
        size={{ width: "xxlarge" }}
        justify="center"
        flex={false}
        alignSelf="end"
        wrap={true}
      >
        {this.props.value || ""}
      </Box>
    );
  }
}

TextWidget.propTypes = {
  value: PropTypes.string
};

function mapStateToProps(state) {
  return {
    formData: state.draftItem.get("formData")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formDataChange: data => dispatch(formDataChange(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextWidget);
