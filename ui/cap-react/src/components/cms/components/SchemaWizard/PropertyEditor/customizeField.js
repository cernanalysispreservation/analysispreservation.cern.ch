import React from "react";

import Box from "grommet/components/Box";

import Form from "../../../../drafts/form/GrommetForm";
import { PropTypes } from "prop-types";
import Button from "../../../../partials/Button";

import Image1 from "./svg/AccordionField";
import Image2 from "./svg/TabObjectField";
import Image3 from "./svg/CenteredObjectField";
import Image4 from "./svg/TwoColLayoutField";
import Image5 from "./svg/TabTwoColLayoutField";
import Image6 from "./svg/SidebatLayout";
import Image7 from "./svg/SidebarTwoColLayout";

import { schemaSchema } from "../../utils/schemas";
import { Label, TextInput, FormField } from "grommet";

import DeleteModal from "./DeletePropertyModal";

const GRID_COLUMNS_OPTIONS = [
  "1/1",
  "1/2",
  "1/3",
  "1/4",
  "1/5",
  "2/2",
  "2/3",
  "2/4",
  "2/5",
  "3/3",
  "3/4",
  "3/5"
];

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

        <Box flex={true} margin={{ bottom: "small" }}>
          <Box
            colorIndex="accent-2"
            flex={false}
            pad="small"
            margin={{ bottom: "small" }}
          >
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
              schema={schemaSchema}
              formData={this.state.schema}
              onChange={this._onSchemaChange.bind(this)}
            />
          </Box>
        </Box>
        <Box>
          <Box
            colorIndex="accent-2"
            flex={false}
            pad="small"
            margin={{ bottom: "small" }}
          >
            <Label size="medium" margin="none">
              Field Layout
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
            {this.props.path.toJS().path.length > 0 &&
              GRID_COLUMNS_OPTIONS.map((gridColumns, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.gridColumnChange(gridColumns)}
                  style={{
                    border:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].grid &&
                      gridColumns ===
                        this.props.uiSchema.toJS()["ui:options"].grid
                          .gridColumns
                        ? "1px solid black"
                        : null,
                    background:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].grid &&
                      gridColumns ===
                        this.props.uiSchema.toJS()["ui:options"].grid
                          .gridColumns
                        ? "black"
                        : null,
                    color:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].grid &&
                      gridColumns ===
                        this.props.uiSchema.toJS()["ui:options"].grid
                          .gridColumns
                        ? "white"
                        : null,
                    padding:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].grid &&
                      gridColumns ===
                        this.props.uiSchema.toJS()["ui:options"].grid
                          .gridColumns
                        ? "0 2px"
                        : null,
                    borderRadius:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].grid &&
                      gridColumns ===
                        this.props.uiSchema.toJS()["ui:options"].grid
                          .gridColumns
                        ? "3px"
                        : null
                  }}
                >
                  {gridColumns}
                </Box>
              ))}
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
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            <Box flex={false} margin="small">
              <Image1 />
            </Box>
            <Box flex={false} margin="small">
              <Image2 />
            </Box>
            <Box flex={false} margin="small">
              <Image3 />
            </Box>
            <Box flex={false} margin="small">
              <Image4 />
            </Box>
            <Box flex={false} margin="small">
              <Image5 />
            </Box>
            <Box flex={false} margin="small">
              <Image6 />
            </Box>
            <Box flex={false} margin="small">
              <Image7 />
            </Box>
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
              Actions
            </Label>
          </Box>
          <FormField>
            <Box direction="row" flex>
              <TextInput
                id="pattern"
                name="pattern"
                placeHolder="Update the id of the field"
                onDOMChange={e => this.setState({ updateId: e.target.value })}
              />
              <Button
                text="Update"
                onClick={() =>
                  this.props.renameId(
                    this.props.path.toJS(),
                    this.state.updateId
                  )
                }
              />
            </Box>
          </FormField>
          <Button
            text="Delete"
            margin={{ top: "small" }}
            critical
            onClick={() => this.setState({ showDeleteLayer: true })}
          />
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
  deleteByPath: PropTypes.func
};

export default CustomizeField;
