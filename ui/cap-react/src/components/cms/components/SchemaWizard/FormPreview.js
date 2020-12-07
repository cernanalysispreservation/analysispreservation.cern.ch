import React from "react";
import { PropTypes } from "prop-types";

import CleanForm from "../../../drafts/form/CleanForm";
import { transformSchema } from "../../../drafts/DraftEditor";
import { Box, Heading } from "grommet";

class FormPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "guidelines"
    };
  }
  render() {
    return Object.keys(this.props.schema.toJS().properties).length === 0 ? (
      <Box flex align="center" justify="center">
        <Box size="large" pad="small" colorIndex="grey-3">
          <Box direction="row" align="center" justify="between">
            <Box onClick={() => this.setState({ selected: "guidelines" })}>
              <Heading
                tag="h3"
                style={{
                  color:
                    this.state.selected === "guidelines"
                      ? "rgb(0,0,0)"
                      : "rgba(0,0,0,.5)"
                }}
              >
                Guidelines
              </Heading>
            </Box>
            <Box onClick={() => this.setState({ selected: "suggestions" })}>
              <Heading
                tag="h3"
                style={{
                  color:
                    this.state.selected === "suggestions"
                      ? "rgb(0,0,0)"
                      : "rgba(0,0,0,0.4)"
                }}
              >
                Suggestions
              </Heading>
            </Box>
          </Box>
          {this.state.selected === "guidelines" ? (
            <Box colorIndex="grey-3">
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                1. Build your schema by dragging any field box you want in the
                drop area
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                2. Once you drop a field you will be able to customize
                properties such as title, description, placeholder, etc
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                3. Specific fields support nested functionalities. (JSON Object,
                Arrays, Tab, Accordion, Layer/Modal)
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                4. In order to add a field as nested element, hover it above the
                target field and drop it. Indicators will support you.
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                5. You can delete any field any time.
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                6. You can export your form in JSON format any time.
              </Box>
            </Box>
          ) : (
            <Box colorIndex="grey-3">
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                1. Start by adding an Object field as a root, preferably a Tab
                object
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                2.Make sure you added the field in the desired place
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                3. Validate your schema from your schema tree
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                4. Apply any css changes you like
              </Box>
              <Box
                colorIndex="light-1"
                margin={{ vertical: "small" }}
                pad="small"
              >
                5. Export anytime so your see your schema in a json file
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    ) : (
      <CleanForm
        schema={transformSchema(this.props.schema.toJS())}
        uiSchema={this.props.uiSchema.toJS()}
        formData={{}}
      >
        <span />
      </CleanForm>
    );
  }
}

FormPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default FormPreview;
