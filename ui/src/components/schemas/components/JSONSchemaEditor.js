import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import JSONEditor from "./JSONEditor";
import JSONEditorUtils from "./SchemaEditorUtils";

import FormNextIcon from "grommet/components/icons/base/FormNext";
import FormDownIcon from "grommet/components/icons/base/FormDown";

class JSONSchemaEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true
    };
  }

  toggleActive = () => this.setState({ active: !this.state.active });

  render() {
    return this.state.active ? (
      <Box flex={true}>
        <Box
          justify="between"
          pad="small"
          margin="none"
          direction="row"
          separator="all"
        >
          <Box align="center" direction="row">
            <strong style={{ paddingRight: "10px" }}>
              {this.props.title || "Schema"}:{" "}
            </strong>
            {this.props.schemaTitle || "schema_url/path/schema.json"}
          </Box>
          <FormNextIcon onClick={this.toggleActive} />
        </Box>
        <Box flex={true}>
          <JSONEditor
            itemType={this.props.itemType}
            onChange={this.props.onChange || null}
            value={this.props.original}
          />
        </Box>
        <JSONEditorUtils
          original={this.props.original}
          updated={this.props.updated}
        />
      </Box>
    ) : (
      <Box flex={false} style={{ width: "50px" }} pad="small" separator="all">
        <FormDownIcon onClick={this.toggleActive} />
        <span
          style={{ transform: "rotate(90deg)", transformOrigin: "left 20px 0" }}
        >
          {this.props.title || "Schema"}
        </span>
      </Box>
    );
  }
}

JSONSchemaEditor.propTypes = {
  title: PropTypes.string,
  schemaTitle: PropTypes.string,
  value: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    original: state.schemas.getIn([
      "items",
      ownProps.schema_path,
      "original",
      ownProps.itemType
    ]),
    updated: state.schemas.getIn([
      "items",
      ownProps.schema_path,
      "updated",
      ownProps.itemType
    ])
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
)(JSONSchemaEditor);
