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

import { schemasItemUpdate } from "../../../actions/schemas";

class SchemaEditorGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  _updateSchema(type) {
    return data => {
      this.props.updateSchema(this.props.schema_path, type, data);
    };
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <JSONSchemaEditor
          schema_path={this.props.schema_path}
          title="Deposit"
          onChange={this._updateSchema("deposit")}
          itemType="deposit"
        />
        <JSONSchemaEditor
          schema_path={this.props.schema_path}
          title="Record"
          onChange={this._updateSchema("record")}
          itemType="record"
        />
        <JSONSchemaEditor
          schema_path={this.props.schema_path}
          title="Options"
          onChange={this._updateSchema("options")}
          itemType="options"
        />
      </Box>
    );
  }
}

SchemaEditorGrid.propTypes = {};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    updateSchema: (path, type, data) =>
      dispatch(schemasItemUpdate(path, type, data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaEditorGrid);
