import React from "react";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import FormAddIcon from "grommet/components/icons/base/FormAdd";
import { PropTypes } from "prop-types";
import { selectProperty } from "../../../../../../actions/schemaWizard";

class SchemaTreeItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick = () => {
    // this.props.selectProperty(this.props.rawErrors[0]);
    this.props.selectProperty(this.props.path);
  };

  _addProperty = () => {
    this.props.addProperty(this.props.path);
  };

  _addItem = () => {
    this.props.addItem(this.props.path);
  };

  render() {
    let _id =
      this.props.type == "array"
        ? this.props.path.schema[this.props.path.schema.length - 2]
        : this.props.path.schema[this.props.path.schema.length - 1];
    return (
      <div
        style={{
          borderBottom: "2px solid #64727d"
        }}
      >
        <Box
          colorIndex={this.props.colorIndex || "light-2"}
          separator="all"
          pad={{ horizontal: "small" }}
          direction="row"
          align="center"
          justify="between"
          wrap={false}
        >
          {this.props.schema ? (
            <Box
              onClick={this._onClick.bind(this)}
              direction="row"
              align="center"
              wrap={false}
            >
              <Label size="small" margin="none">
                <strong>
                  {mapType2Icon[this.props.schema.type] || "missing"}
                </strong>
              </Label>
              <Box flex={false} pad={{ horizontal: "small" }} align="start">
                <div>{this.props.schema.title || "Untitled field"}</div>
                <div
                  style={{
                    padding: "0 3px",
                    marginBottom: "4px",
                    backgroundColor: "#e6e6e6",
                    fontSize: "11px"
                  }}
                >
                  {_id}
                </div>
              </Box>
            </Box>
          ) : null}
          {this.props.schema ? (
            <Box direction="row" align="center" wrap={false} flex={false}>
              {this.props.schema.type == "object" ? (
                <FormAddIcon onClick={this._addProperty} />
              ) : null}
              {this.props.schema.type == "array" ? (
                <FormAddIcon onClick={this._addItem} />
              ) : null}
            </Box>
          ) : null}
        </Box>
      </div>
    );
  }
}

SchemaTreeItem.propTypes = {
  schema: PropTypes.object,
  id: PropTypes.string,
  path: PropTypes.array,
  selectProperty: PropTypes.func,
  addProperty: PropTypes.func,
  addItem: PropTypes.func,
  type: PropTypes.string,
  colorIndex: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return {
    selectProperty: path => dispatch(selectProperty(path))
  };
}
export default connect(
  state => state,
  mapDispatchToProps
)(SchemaTreeItem);

let mapType2Icon = {
  object: "{ }",
  array: "[ ]",
  boolean: "0/1",
  string: "abc",
  number: "123.45"
};
