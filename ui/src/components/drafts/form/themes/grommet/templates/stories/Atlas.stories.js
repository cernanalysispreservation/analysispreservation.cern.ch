import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import {
  withKnobs,
  select,
  text,
  boolean,
  array
} from "@storybook/addon-knobs/react";
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

storiesOf("Atlas Form", module)
  .addDecorator(withKnobs)
  .add("default", () => {
    // grid options
    const options = {
      Grid_1_5: "1 / 5",
      Grid_1_4: "1 / 4",
      Grid_1_3: "1 / 3",
      Grid_1_2: "1 / 2",
      Grid_2_3: "2 / 3",
      Grid_2_4: "2 / 4",
      Grid_2_5: "2 / 5",
      Grid_3_4: "3 / 4",
      Grid_3_5: "3 / 5"
    };

    // uiArray options
    const uiArray = ["default", "AccordionArrayField", "LayerArrayField"];
    // schema
    const schemaATLAS = {
      properties: {
        basic_info: {
          id: "basic_info",
          properties: {
            abstract: {
              title: text("Abstract Title:", "Abstract", "ABSTRACT"),
              description: text(
                "Abstarct Description:",
                "ex this is the description",
                "ABSTRACT"
              ),
              type: "string"
            },
            analysis_title: {
              title: text(
                "Analysis Title:",
                "Analysis Title",
                "ANALYSIS_TITLE"
              ),
              description: text(
                "Analysis Description:",
                "ex this is the description",
                "ANALYSIS_TITLE"
              ),
              type: "string"
            },
            glance_id: {
              title: text("Glance Title:", "Glance ID", "GLANCE_ID"),
              description: text(
                "Glance Description:",
                "ex this is the description",
                "GLANCE_ID"
              ),
              type: "string"
            },
            people_info: {
              items: {
                properties: {
                  email: {
                    title: "Email-Adress",
                    type: "string"
                  },
                  name: {
                    title: "Name",
                    type: "string"
                  },
                  orcid: {
                    pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$",
                    title: "ORCID",
                    type: "string"
                  }
                },
                type: "object"
              },
              title: text("People Title:", "People Involved", "PEOPLE_INFO"),

              type: "array"
            }
          },
          propertyOrder: 10,
          required: ["analysis_title", "glance_id"],
          title: "Basic Information",
          type: "object"
        },
        input_datasets: {
          default: [{}],
          description:
            "Datasets relevant for this analysis (including all datasets for all main and auxiliary measurements)",
          id: "input_datasets",
          items: {
            description: "Information concerning the ATLAS datasets used",
            properties: {
              dataset_title: {
                title: "Title",
                type: "string"
              },
              format: {
                title: "Data Format",
                type: "string"
              },
              type: {
                title: "Data Type",
                type: "string"
              }
            },
            title: "ATLAS Dataset",
            type: "object"
          },
          title: "Input Data",
          type: "array"
        }
      },
      title: "ATLAS Analysis",
      type: "object"
    };
    //uischema
    const schemaATLASUI = {
      "ui:object": boolean("TabView", true, "TAB") ? "tabView" : "",
      "ui:options": {
        full: boolean("Full", true, "TAB"),
        view: {
          sidebarColor: text("sidebarColor", "grey-5-a", "TAB")
        }
      },
      "ui:order": boolean("Order", true, "TAB")
        ? ["basic_info", "input_datasets", "*"]
        : ["input_datasets", "basic_info", "*"],

      input_datasets: {
        "ui:array": select("input data", uiArray, "default", "UI_ARRAY")
      },

      basic_info: {
        "ui:order": array(
          "Items Order",
          ["analysis_title", "glance_id", "abstract", "people_info", "*"],
          ",",
          "ITEMS_ORDER"
        ),
        analysis_title: {
          "ui:options": {
            grid: {
              gridColumns: select(
                "Analysis Title Grid",
                options,
                "1 / 5",
                "ANALYSIS_TITLE"
              )
            }
          }
        },
        people_info: {
          "ui:options": {
            grid: {
              gridColumns: select(
                "People Info Grid",
                options,
                "1 / 5",
                "PEOPLE_INFO"
              )
            }
          }
        },
        glance_id: {
          "ui:options": {
            grid: {
              gridColumns: select(
                "Glance ID Grid",
                options,
                "1 / 5",
                "GLANCE_ID"
              )
            }
          }
        },
        abstract: {
          "ui:options": {
            grid: {
              gridColumns: select("Abstract Grid", options, "1 / 5", "ABSTRACT")
            }
          }
        }
      }
    };

    return <CleanFormStorie schema={schemaATLAS} uiSchema={schemaATLASUI} />;
  });
