import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";

import VirtualMachineIcon from "grommet/components/icons/base/VirtualMachine";

import thebeLabContents from "./thebeLabContents";

class theBeLabField extends Component {
  constructor(props) {
    super(props);

    // TODO: Change URL to JSON and update how to construct 'thebeLabContents'
    this.state = {
      layerOpen: false,
      urlToGrab:
        "https://gist.githubusercontent.com/lukasheinrich/dd680c74daf9655db5b8d44c2b4e229e/raw/13b38786241fe118f344e6af35767b2cfefb7fc7/wspac"
    };
  }

  toggleLayer = () => this.setState({ layerOpen: !this.state.layerOpen });

  render() {
    return [
      <Box
        key="visualize_button"
        pad={{ horizontal: "medium" }}
        style={{ overflow: "hidden" }}
        size={{ width: "xxlarge" }}
        justify="start"
        flex={true}
        alignSelf="end"
      >
        <Box flex={false}>
          <Button
            icon={<VirtualMachineIcon />}
            label="Click to Visualize"
            onClick={this.toggleLayer}
          />
        </Box>
      </Box>,
      this.state.layerOpen ? (
        <Layer
          key="visualize_layer"
          pad="none"
          closer={true}
          onClose={this.toggleLayer}
        >
          <Box pad="medium" size={{ height: "xxlarge", width: "xxlarge" }}>
            <iframe
              frameBorder={0}
              style={{ width: "100%", height: "100%", minHeight: "400px" }}
              srcDoc={thebeLabContents(this.state.urlToGrab)}
            />
          </Box>
        </Layer>
      ) : null
    ];
  }
}

theBeLabField.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func
};

export default theBeLabField;
