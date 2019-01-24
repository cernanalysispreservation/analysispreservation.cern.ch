import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";

import JSONInput from "react-json-editor-ajrm";

class JSONEditorLayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value || {},
      error: true
    };
  }

  onChange = data => {
    if (!data.error) {
      this.setState({ error: false, data: data.jsObject });
    } else this.setState({ error: true });
  };

  updateFormData = () => {
    this.props.setJSON(this.state.data);
    this.props.onClose();
  };

  render() {
    return (
      <Layer overlayClose={true} onClose={this.props.onClose} closer={true}>
        <Box size={{ height: "large", width: "large" }} pad="medium">
          <Box flex={true}>
            <JSONInput
              width="100%"
              height="100%"
              placeholder={this.state.data}
              onChange={this.onChange}
            />
          </Box>
          <Box
            wrap={false}
            justify="between"
            direction="row"
            pad={{ vertical: "small" }}
          >
            <Button label="Cancel" onClick={this.props.onClose} />
            <Button
              primary={true}
              label="Add/Update"
              onClick={this.state.error ? null : this.updateFormData}
            />
          </Box>
        </Box>
      </Layer>
    );
  }
}

JSONEditorLayer.propTypes = {
  value: PropTypes.object,
  setJSON: PropTypes.func,
  onClose: PropTypes.func
};

export default JSONEditorLayer;
