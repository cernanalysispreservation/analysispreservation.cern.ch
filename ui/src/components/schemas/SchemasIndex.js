import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";

import JSONSchemaEditorGrid from "./components/JSONSchemaEditorGrid";
import SchemasLayer from "./components/SchemasLayer";
// import DiffsLayer from "./components/DiffsLayer";

import { getSchemas, getSchemaByPath } from "../../actions/schemas";

import WizardSVG from "./static/wizard";
import JSONSchemaIcon from "./static/JSONSchemaIcon";

class SchemasIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schemasLayer: false,
      schema: null
    };
  }

  componentDidMount() {
    this.props.getSchemas();
  }

  toggleSchemaLayer = () => {
    this.setState({ schemasLayer: !this.state.schemasLayer });
  };

  selectSchema = path => {
    this.setState({ schema: path }, () => {
      this.toggleSchemaLayer();
      this.props.getSchemaByPath(this.state.schema);
    });
  };

  render() {
    return (
      <Box flex={true} colorIndex="light-2">
        <Header
          flex={false}
          size="small"
          pad={{ horizontal: "small" }}
          margin="none"
        >
          <Box flex={true} colorIndex="light-2" />
          <Box
            flex={false}
            colorIndex="light-2"
            justify="center"
            align="center"
            direction="row"
          >
            <JSONSchemaIcon />
            <WizardSVG />
            <Anchor
              label="( change schema )"
              onClick={this.toggleSchemaLayer}
            />
          </Box>
          <Box
            flex={true}
            colorIndex="light-2"
            align="end"
            justify="end"
            direction="row"
          >
            <Anchor label="Update" onClick={this.toggleDiffsLayer} />
          </Box>
        </Header>
        <JSONSchemaEditorGrid schema_path={this.state.schema} />
        <SchemasLayer
          schemas={this.props.schemas_list}
          selectSchema={this.selectSchema}
          activeLayer={this.state.schemasLayer}
          toggleLayer={this.toggleSchemaLayer}
        />
      </Box>
    );
  }
}

SchemasIndex.propTypes = {};

function mapStateToProps(state, props) {
  return {
    schemas_list: state.schemas.getIn(["list", "data"]),
    schema: state.schemas.getIn(["items", state.schema, "data"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSchemas: () => dispatch(getSchemas()),
    getSchemaByPath: path => dispatch(getSchemaByPath(path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemasIndex);
