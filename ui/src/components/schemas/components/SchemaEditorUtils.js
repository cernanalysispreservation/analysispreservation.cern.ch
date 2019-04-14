import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import Layer from "grommet/components/Layer";
import Paragraph from "grommet/components/Paragraph";
import Table from "grommet/components/Table";
import TableRow from "grommet/components/TableRow";
import Toast from "grommet/components/Toast";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Tabs from "grommet/components/Tabs";
import Tab from "grommet/components/Tab";

import JSONSchemaEditor from "./JSONSchemaEditor";
// import DiffsLayer from "./DiffsLayer";
// import jsondiffpatch from "jsondiffpatch";
let jsondiffpatch = require("jsondiffpatch").create();
// require('jsondiffpatch/formatters-styles/html');
import { formatters } from "jsondiffpatch";

// let jsondiffpatch = require('jsondiffpatch').create();

import { getSchemaByPath, schemasItemUpdate } from "../../../actions/schemas";

class SchemaEditorUtils extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: null
    };
  }

  componentDidMount() {
    this.props.getSchemaByPath(this.props.schema_path);
  }

  _updateSchema(type) {
    return data => {
      this.props.updateSchema(this.props.schema_path, type, data);
    };
  }

  _getDiffs() {
    console.log("_getDiffs::", this.props.original, this.props.updated);
    let _diff = jsondiffpatch.diff(this.props.original, this.props.updated);
    // let _diff = jsondiffpatch.diff(this.props.schema.deposit, this.props.updated.get("deposit"));
    let visual = formatters.html.format(_diff, this.props.original);
    console.log("visual:::", visual);

    return visual;
  }

  toggleView = tab => this.setState({ activeTab: tab });

  renderSwitch() {
    switch (this.state.activeTab) {
      case "diffs":
        return (
          <Box
            flex={true}
            margin={{ left: "large" }}
            size={{ height: { min: "small" } }}
            direction="row"
            align="start"
            justify="start"
            colorIndex="light-2"
          >
            <span
              className="jsondiffpatch-visual-container"
              dangerouslySetInnerHTML={{ __html: this._getDiffs() }}
            />
          </Box>
        );
      case "original":
        return (
          <Box
            flex={true}
            margin={{ left: "large" }}
            direction="row"
            align="start"
            justify="start"
            colorIndex="light-2"
          >
            original
          </Box>
        );
      // default:
      //   return null;
    }
  }

  render() {
    return (
      <Box flex={false} colorIndex="grey-3">
        <Box flex={true} colorIndex="grey-3">
          <Box flex={false} direction="row" justify="end" colorIndex="grey-3">
            {this.state.activeTab}
            <Anchor
              tag={Box}
              pad={{ horizontal: "small" }}
              separator="right"
              colorIndex="brand"
              label="Diffs"
              onClick={() => this.toggleView("diffs")}
            />
            <Anchor
              tag={Box}
              pad={{ horizontal: "small" }}
              separator="right"
              colorIndex="brand"
              label="Original JSON"
              onClick={() => this.toggleView("original")}
            />
          </Box>
          {this.renderSwitch()}
        </Box>
      </Box>
    );
  }
}

SchemaEditorUtils.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    // schema: state.schemas.getIn(["items", ownProps.schema_path, "original", ownProps.itemType]),
    // updated: state.schemas.getIn(["items", ownProps.schema_path, "updated", ownProps.itemType]),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSchema: (path, type, data) =>
      dispatch(schemasItemUpdate(path, type, data)),
    getSchemaByPath: path => dispatch(getSchemaByPath(path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaEditorUtils);
