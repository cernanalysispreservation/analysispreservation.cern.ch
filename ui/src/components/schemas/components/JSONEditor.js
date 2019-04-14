import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import JSONInput from "react-json-editor-ajrm";

class JSONEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value || {},
      error: true
    };
  }

  onChange = event => {
    if (!event.error) {
      this.props.onChange ? this.props.onChange(event.jsObject) : null;
    } else this.setState({ error: true });
  };

  updateFormData = () => {
    this.props.setJSON(this.state.data);
  };

  render() {
    return (
      <JSONInput
        width="100%"
        height="100%"
        colors={JSONInputColors}
        style={JSONInputStyles}
        placeholder={this.props.value || {}}
        onChange={this.onChange}
      />
    );
  }
}

let JSONInputColors = {
  default: "#D4D4D4",
  background: "#FCFDFD",
  background_warning: "#FEECEB",
  string: "red",
  number: "#70CE35",
  colon: "#49B8F7",
  keys: "blue",
  keys_whiteSpace: "#835FB6",
  primitive: "#386FA4"
};

let JSONInputStyles = {
  outerBox: "#f7f7f7",
  labelColumn: { backgroundColor: "#f7f7f7", border: "1px solid #ddd" }
};

JSONEditor.propTypes = {
  setJSON: PropTypes.func,
  value: PropTypes.object
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JSONEditor);
