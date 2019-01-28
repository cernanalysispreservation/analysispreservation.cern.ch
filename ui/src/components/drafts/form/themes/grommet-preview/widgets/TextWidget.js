import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import { connect } from "react-redux";
import { formDataChange } from "../../../../../../actions/drafts";

class TextWidget extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Box
        style={{ overflow: "hidden" }}
        pad={{ horizontal: "medium" }}
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
    formData: state.drafts.getIn(["current_item", "formData"])
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
