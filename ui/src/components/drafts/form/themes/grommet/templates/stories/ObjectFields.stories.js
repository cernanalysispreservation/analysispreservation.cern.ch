import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import CleanForm from "../../../../CleanForm";
import store from "../../../../../../../store/configureStore";
import { Provider } from "react-redux";

import PropTypes from "prop-types";

class CleanFormStorie extends Component {
  render() {
    return (
      <Grommet>
        <Box>
          <Provider store={store}>
            <CleanForm
              schema={this.props.schema}
              uiSchema={this.props.uiSchema}
            >
              <span />
            </CleanForm>
          </Provider>
        </Box>
      </Grommet>
    );
  }
}

CleanFormStorie.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

storiesOf("Object Fields", module).add("default", () => {
  // schema
  const schemaATLAS = {
    properties: {
      default: {
        default: [{}],
        description:
          "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
        id: "input_datasets",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Default Object",
        type: "object"
      },
      layer: {
        default: [{}],
        description:
          "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
        id: "input_datasets",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },

        title: "Layer Object",
        type: "object"
      },
      accordion: {
        default: [{}],
        description:
          "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
        id: "input_datasets",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Accordion Object",
        type: "object"
      }
    },
    title: "Array Fields",
    type: "object"
  };
  //uischema
  const schemaATLASUI = {
    "ui:object": "tabView",
    "ui:options": {
      full: true,
      view: {
        sidebarColor: "grey-5-a"
      }
    },
    "ui:order": ["basic_info", "input_datasets", "*"],
    default: {},
    layer: {
      "ui:object": "layerObjectField"
    },
    accordion: {
      "ui:object": "accordionObjectField"
    }
  };

  return <CleanFormStorie schema={schemaATLAS} uiSchema={schemaATLASUI} />;
});
