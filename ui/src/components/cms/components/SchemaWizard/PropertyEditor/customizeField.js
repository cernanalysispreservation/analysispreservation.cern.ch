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
