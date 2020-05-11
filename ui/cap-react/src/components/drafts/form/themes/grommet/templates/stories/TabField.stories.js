import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import CleanForm from "../../../../CleanForm";
import store from "../../../../../../../store/configureStore";
import { Provider } from "react-redux";

import PropTypes from "prop-types";

// schema
const schemaATLAS = {
  properties: {
    default: {
      default: [{}],
      description:
        "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
      id: "input_datasets",
      items: {
        description: "This is a default array example",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Default",
        type: "object"
      },
      title: "Default Array",
      type: "array"
    },
    layer: {
      default: [{}],
      description:
        "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
      id: "input_datasets",
      items: {
        description: "This is a layer array example",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Default",
        type: "object"
      },
      title: "Layer Array",
      type: "array"
    },
    accordion: {
      default: [{}],
      description:
        "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
      id: "input_datasets",
      items: {
        description: "This is an accordion array example",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Default",
        type: "object"
      },
      title: "Accordion Array",
      type: "array"
    },
    antonis: {
      default: [{}],
      description:
        "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
      id: "input_datasets",
      items: {
        description: "This is an accordion array example",
        properties: {
          dataset_title: {
            title: "Title",
            type: "string"
          }
        },
        title: "Default",
        type: "object"
      },
      title: "Accordion Array",
      type: "array"
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
    },
    initTab: "merge",
    tabs: [
      {
        id: "merged",
        name: "merged",
        title: "merged",
        content: ["default", "layer"]
      },
      {
        id: "merge",
        name: "merge",
        title: "merge",
        content: ["antonis", "accordion"]
      }
    ]
  },
  "ui:order": ["default", "layer", "*"],
  default: {
    "ui:array": "default"
  },
  layer: {
    "ui:array": "LayerArrayField"
  },
  accordion: {
    "ui:array": "AccordionArrayField"
  },
  antonis: {
    "ui:array": "AccordionArrayField"
  }
};

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

storiesOf("Tab Field", module).add("default", () => {
  return <CleanFormStorie schema={schemaATLAS} uiSchema={schemaATLASUI} />;
});
