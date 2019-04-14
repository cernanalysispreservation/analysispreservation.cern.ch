import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Paragraph from "grommet/components/Paragraph";
import Header from "grommet/components/Header";

import jsondiffpatch from "jsondiffpatch";

export default class DiffsLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.activeLayer ? (
      <Layer
        flush={true}
        pad="none"
        closer={true}
        overlayClose={true}
        onClose={this.props.toggleLayer}
      >
        <Box size="xlarge" pad="none">
          <Header
            flex={false}
            size="small"
            justify="center"
            pad={{ horizontal: "small" }}
            margin="none"
            colorIndex="grey-3"
          >
            Update Schemas
          </Header>
          <Box justify="center" align="center">
            <Paragraph justify="center" align="center">
              Below you can preview the changes made to the schemas, options,
              mappings. Check that all changes you wanted to do are correct and
              click <strong>Update</strong>
            </Paragraph>
          </Box>
          <Box justify="center" align="center" />
        </Box>
      </Layer>
    ) : null;
  }
}

const getDiffs = (original, updated) => {};

DiffsLayer.propTypes = {
  toggleLayer: PropTypes.func,
  selectSchema: PropTypes.func,
  schemas: PropTypes.array.isRequired,
  activeLayer: PropTypes.bool.isRequired
};
