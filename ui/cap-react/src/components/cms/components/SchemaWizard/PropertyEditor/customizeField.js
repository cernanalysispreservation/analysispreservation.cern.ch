import React from "react";

import Box from "grommet/components/Box";

import Form from "../../../../drafts/form/GrommetForm";
import { PropTypes } from "prop-types";
import Button from "../../../../partials/Button";

import fieldTypes from "../../utils/fieldTypes";
import { Label, TextInput, FormField } from "grommet";

import DeleteModal from "./DeletePropertyModal";
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

  getSchemaForm = uiSchema => {
    // check if there is not uiSchema
    if (!uiSchema) return;
    let type;
    if (uiSchema["ui:widget"]) {
      type = uiSchema["ui:widget"];
    }
    if (uiSchema["ui:field"]) {
      type = uiSchema["ui:field"];
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
            uiSchema={uiSchema}
            formData={this.state.schema}
            onChange={_debounce(this._onSchemaChange.bind(this), 500)}
          />
        </Box>
      </Box>
    );
  };

  getUISchemaForm = uiSchema => {
    // check if there is not uiSchema
    if (!uiSchema) return;
    let type;
    if (uiSchema["ui:widget"]) {
      type = uiSchema["ui:widget"];
    }
    if (uiSchema["ui:field"]) {
      type = uiSchema["ui:field"];
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
        <DeleteModal
          show={this.state.showDeleteLayer}
          text={this.props.path
            .toJS()
            .path.filter(item => item != "properties" && item != "items")
            .map(item => item)
            .join(" > ")}
          onClose={() => this.setState({ showDeleteLayer: false })}
          onDelete={() => {
            this.props.deleteByPath(this.props.path.toJS());
            this.setState({ showDeleteLayer: false });
          }}
        />
        {this.getSchemaForm(this.props.uiSchema && this.props.uiSchema.toJS())}
        <Box>
          <Box colorIndex="accent-2" flex={false} pad="small">
            <Label size="medium" margin="none">
              Field Layout
            </Label>
          </Box>

          <Box colorIndex="light-1" flex={false} pad="small">
            <Label size="small" margin="none">
              Select the in-line position of your field
            </Label>
          </Box>
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
          {this.getUISchemaForm(
            this.props.uiSchema && this.props.uiSchema.toJS()
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
        <Box>
          <Box
            colorIndex="accent-2"
            flex={false}
            pad="small"
            margin={{ top: "small" }}
          >
            <Label size="medium" margin="none">
              Item Actions
            </Label>
          </Box>
          <Box colorIndex="light-1" pad="small">
            {this.props.path.toJS().uiPath.pop() !== "items" && (
              <Box margin={{ bottom: "small" }}>
                Update ID
                <Box direction="row">
                  <FormField>
                    <Box direction="row" flex>
                      <TextInput
                        id="pattern"
                        name="pattern"
                        placeHolder="New field id"
                        onDOMChange={e =>
                          this.setState({ updateId: e.target.value })
                        }
                      />
                    </Box>
                  </FormField>
                  <Button
                    text="Update"
                    background="#e9e9e9"
                    onClick={() =>
                      this.props.renameId(
                        this.props.path.toJS(),
                        this.state.updateId
                      )
                    }
                  />
                </Box>
              </Box>
            )}
            <Button
              text="Delete Item"
              margin={{ top: "small" }}
              critical
              onClick={() => this.setState({ showDeleteLayer: true })}
            />
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
  optionsSchema: PropTypes.object
};

export default CustomizeField;
