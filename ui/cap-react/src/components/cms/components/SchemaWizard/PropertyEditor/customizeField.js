import React from "react";

import Box from "grommet/components/Box";

import Form from "../../../../drafts/form/GrommetForm";
import { PropTypes } from "prop-types";

import fieldTypes from "../../utils/fieldTypes";
import { Label } from "grommet";

import _debounce from "lodash/debounce";

const SIZE_OPTIONS = ["small", "large", "xlarge", "xxlarge", "full"];

const ALIGN_OPTIONS = ["center", "start", "end"];

class CustomizeField extends React.Component {
  static getDerivedStateFromProps(props) {
    return {
      schema: props.schema ? props.schema.toJS() : {}
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      schema: props.schema ? props.schema.toJS() : {},
      uiSchema: props.uiSchema ? props.uiSchema.toJS() : {},
      showDeleteLayer: false,
      updateId: ""
    };
  }

  _onSchemaChange = data => {
    this.setState({ schema: data.formData }, () => {
      this.props.onSchemaChange(
        this.props.path.get("path").toJS(),
        data.formData
      );
    });
  };

  _onUiSchemaChange = data => {
    this.setState({ uiSchema: data.formData }, () => {
      this.props.onUiSchemaChange(
        this.props.path.get("uiPath").toJS(),
        data.formData
      );
    });
  };

  gridChange = new_grid => {
    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { grid = {}, ...restUIOptions } = uiOptions;

    grid = { ...grid, ...new_grid };
    let _uiOptions = { grid, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  gridColumnChange = new_gridColumn => {
    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { grid = {}, ...restUIOptions } = uiOptions;

    // delete previous gridColumns
    delete grid.gridColumns;

    grid = { ...grid, gridColumns: new_gridColumn };

    let _uiOptions = { grid, ...restUIOptions };
    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  sizeChange = newSize => {
    if (SIZE_OPTIONS.indexOf(newSize) < 0) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { size, ...restUIOptions } = uiOptions;

    size = newSize;
    let _uiOptions = { size, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  alignChange = newAlign => {
    if (["center", "start", "end"].indexOf(newAlign) < 0) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { align, ...restUIOptions } = uiOptions;

    align = newAlign;
    let _uiOptions = { align, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  getSchemaForm = (uiSchema = {}, schema = {}) => {
    let type;

    // in case we can not define the type of the element from the uiSchema,
    // extract the type from the schema
    if (
      !uiSchema ||
      (!uiSchema["ui:widget"] &&
        !uiSchema["ui:field"] &&
        !uiSchema["ui:object"])
    ) {
      type = schema.type === "string" ? "text" : schema.type;
    } else {
      if (uiSchema["ui:widget"]) {
        type = uiSchema["ui:widget"];
      }
      if (uiSchema["ui:field"]) {
        type = uiSchema["ui:field"];
        if (
          uiSchema["ui:field"] === "idFetcher" &&
          uiSchema["ui:servicesList"].length < 3
        ) {
          type = uiSchema["ui:servicesList"][0].value;
        }
      }
      if (uiSchema["ui:object"]) {
        type = uiSchema["ui:object"];
      }
    }

    // if there is no type then there is nothing to return
    if (!type) return;
    const objs = {
      ...fieldTypes.advanced.fields,
      ...fieldTypes.simple.fields
    };

    return (
      <Box flex={true}>
        <Box colorIndex="accent-2" flex={false} pad="small">
          <Label size="medium" margin="none">
            Basic field info
          </Label>
        </Box>
        <Box
          flex={true}
          colorIndex="light-2"
          pad="none"
          margin={{ bottom: "medium" }}
        >
          <Form
            schema={objs[type].optionsSchema}
            uiSchema={objs[type].optionsSchemaUiSchema}
            formData={this.state.schema}
            onChange={_debounce(this._onSchemaChange.bind(this), 500)}
          />
        </Box>
      </Box>
    );
  };

  getUISchemaForm = (uiSchema = {}, schema = {}) => {
    let type;
    // in case we can not define the type of the element from the uiSchema,
    // extract the type from the schema
    if (
      !uiSchema ||
      (!uiSchema["ui:widget"] &&
        !uiSchema["ui:field"] &&
        !uiSchema["ui:object"])
    ) {
      type = schema.type === "string" ? "text" : schema.type;
    } else {
      if (uiSchema["ui:widget"]) {
        type = uiSchema["ui:widget"];
      }
      if (uiSchema["ui:field"]) {
        type = uiSchema["ui:field"];
        if (
          uiSchema["ui:field"] === "idFetcher" &&
          uiSchema["ui:servicesList"].length < 3
        ) {
          type = uiSchema["ui:servicesList"][0].value;
        }
      }
      if (uiSchema["ui:object"]) {
        type = uiSchema["ui:object"];
      }
    }
    // if there is no type then there is nothing to return
    if (!type) return;
    const objs = {
      ...fieldTypes.advanced.fields,
      ...fieldTypes.simple.fields
    };

    if (!objs[type]) return;

    return (
      <Box
        flex={true}
        colorIndex="light-2"
        pad="none"
        margin={{ bottom: "medium" }}
      >
        <Box colorIndex="accent-2" flex={false} pad="small">
          <Label size="medium" margin="none">
            Field Layout
          </Label>
        </Box>
        <Form
          schema={objs[type].optionsUiSchema}
          uiSchema={objs[type].optionsUiSchemaUiSchema}
          formData={uiSchema}
          onChange={_debounce(this._onUiSchemaChange.bind(this), 500)}
        />
      </Box>
    );
  };

  render() {
    return (
      <Box flex={false}>
        {this.getSchemaForm(
          this.props.uiSchema && this.props.uiSchema.toJS(),
          this.props.schema && this.props.schema.toJS()
        )}
        <Box>
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            {this.props.path.toJS().path.length === 0 &&
              SIZE_OPTIONS.map((size, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.sizeChange(size)}
                  style={{
                    border:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "1px solid black"
                        : null,
                    background:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "black"
                        : null,
                    color:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "white"
                        : null,
                    padding:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "0 2px"
                        : null,
                    borderRadius:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "3px"
                        : null
                  }}
                >
                  {size}
                </Box>
              ))}
          </Box>
          {this.props.path.get("path").size > 0 &&
            this.getUISchemaForm(
              this.props.uiSchema && this.props.uiSchema.toJS(),
              this.props.schema && this.props.schema.toJS()
            )}
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            {this.props.path.toJS().path.length === 0 &&
              ALIGN_OPTIONS.map((align, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.alignChange(align)}
                  style={{
                    border:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "1px solid black"
                        : null,
                    background:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "black"
                        : null,
                    color:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "white"
                        : null,
                    padding:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "0 2px"
                        : null,
                    borderRadius:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "3px"
                        : null
                  }}
                >
                  {align}
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

CustomizeField.propTypes = {
  field: PropTypes.object,
  cancel: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  onSchemaChange: PropTypes.func,
  onUiSchemaChange: PropTypes.func,
  path: PropTypes.array,
  deleteByPath: PropTypes.func,
  optionsSchema: PropTypes.object,
  renameId: PropTypes.func
};

export default CustomizeField;
