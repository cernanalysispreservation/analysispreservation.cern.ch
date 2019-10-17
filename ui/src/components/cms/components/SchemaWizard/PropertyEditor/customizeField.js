import React from "react";

import Box from "grommet/components/Box";

import Form from "../../../../drafts/form/GrommetForm";
import { PropTypes } from "prop-types";

import Image1 from "./svg/AccordionField";
import Image2 from "./svg/TabObjectField";
import Image3 from "./svg/CenteredObjectField";
import Image4 from "./svg/TwoColLayoutField";
import Image5 from "./svg/TabTwoColLayoutField";
import Image6 from "./svg/SidebatLayout";
import Image7 from "./svg/SidebarTwoColLayout";
import { commonSchema, schemaSchema, uiSchema } from "../../utils/schemas";
import { Columns, Label } from "grommet";

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
const DISPALY_OPTIONS = ["flex", "grid", "full"];

class CustomizeField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: props.schema ? props.schema.toJS() : {},
      uiSchema: props.uiSchema ? props.uiSchema.toJS() : {}
    };
  }

  _onSchemaChange = data => {
    this.setState({ schema: data.formData }, () => {
      console.log("))))))))))):::", data);
      this.props.onSchemaChange(
        this.props.path.get("path").toJS(),
        data.formData
      );
    });
  };

  _onUiSchemaChange = data => {
    this.setState({ uiSchema: data.formData }, () => {
      console.log("))))))))))):::", data);
      this.props.onUiSchemaChange(
        this.props.path.get("uiPath").toJS(),
        data.formData
      );
    });
  };

  static getDerivedStateFromProps(props) {
    return {
      schema: props.schema ? props.schema.toJS() : {}
    };
  }

  displayChange = new_display => {
    if (DISPALY_OPTIONS.indexOf(new_display) < 0) return;

    console.log("change  display");
    console.log(display);

    let { uiSchema } = this.props;
    uiSchema = uiSchema.toJS();

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { display, ...restUIOptions } = uiOptions;

    display = new_display;

    let _uiOptions = {};
    if (new_display == "full") _uiOptions = { full: "true", ...restUIOptions };
    else _uiOptions = { display, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  gridChange = new_grid => {
    // if (new_grid.indexOf(['flex','grid'] < 0 ) ) return;

    console.log("change  display");
    console.log(new_grid);

    let { uiSchema } = this.props;
    uiSchema = uiSchema.toJS();

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
    // if (new_grid.indexOf(['flex','grid'] < 0 ) ) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema.toJS();

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { grid = {}, ...restUIOptions } = uiOptions;
    let { gridColumn, ...restGrid } = grid;

    grid = { ...restGrid, gridColumn: new_gridColumn };
    let _uiOptions = { grid, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  sizeChange = newSize => {
    if (SIZE_OPTIONS.indexOf(newSize) < 0) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema.toJS();

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
    uiSchema = uiSchema.toJS();

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
        <Box flex={true} margin={{ bottom: "medium" }}>
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
            <Box
              flex={false}
              margin="small"
              onClick={() => this.displayChange("grid")}
            >
              Grid
            </Box>
            <Box
              flex={false}
              margin="small"
              onClick={() => this.displayChange("flex")}
            >
              Flex
            </Box>
            <Box
              flex={false}
              margin="small"
              onClick={() => this.displayChange("full")}
            >
              Full
            </Box>
          </Box>
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            {GRID_COLUMNS_OPTIONS.map(gridColumns => (
              <Box
                flex={false}
                margin="small"
                onClick={() => this.gridColumnChange(gridColumns)}
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
            {SIZE_OPTIONS.map(size => (
              <Box
                flex={false}
                margin="small"
                onClick={() => this.sizeChange(size)}
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
            {["center", "start", "end"].map(align => (
              <Box
                flex={false}
                margin="small"
                onClick={() => this.alignChange(align)}
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
      </Box>
    );
  }
}

CustomizeField.propTypes = {
  field: PropTypes.object,
  cancel: PropTypes.func
};

export default CustomizeField;
