import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet-preview/templates/FieldTemplate";
import ArrayFieldTemplate from "./themes/grommet/templates/ArrayFieldTemplate";
import ObjectFieldTemplate from "./themes/grommet/templates/ObjectFieldTemplate";

import widgets from "./themes/grommet-preview/widgets";
import fields from "./themes/grommet-preview/fields";
import Form from "react-jsonschema-form";

class JSONShemaPreviewer extends React.Component {
  constructor(props) {
    super(props);

    // make the properties iterable
    const propertiesArray = Object.entries(this.props.schema.properties);

    // calculate how many are objects || arrays
    const allObjectsOrArrays = propertiesArray.filter(
      item => item[1].type === "object" || item[1].type === "array"
    );

    // calculate how many are strings
    const allStrings = propertiesArray.filter(
      item => item[1].type === "string"
    );

    // in order to display the tabView button there are 2 criterias, either one should be true in order to display:
    // 1) all of the fields should be either objects || arrays
    // 2) not all of them should be strings
    const shouldDisplayTabViewButton =
      allObjectsOrArrays.length === propertiesArray.length ||
      allStrings.length < propertiesArray.length;

    this.state = {
      formData: {},
      uiObject:
        shouldDisplayTabViewButton && this.props.displayViewButtons
          ? "tabView"
          : "",
      shouldDisplayTabViewButton
    };
  }

  render() {
    return (
      <Box flex={true}>
        {this.props.displayViewButtons &&
          this.state.shouldDisplayTabViewButton && (
            <Box
              direction="row"
              justify="end"
              responsive={false}
              style={{
                position: "absolute",
                right: 20,
                bottom: 20,
                border: "1px solid #e6e6e6",
                background: "#fff",
                zIndex: 10
              }}
            >
              <Box
                align="center"
                justify="center"
                direction="row"
                responsive={false}
                style={{ padding: "5px" }}
              >
                <Box
                  onClick={() => this.setState({ uiObject: "tabView" })}
                  style={
                    this.state.uiObject === "tabView"
                      ? {
                          color: "rgba(0,0,0,1)",
                          fontWeight: "bold"
                        }
                      : {
                          color: "rgba(0,0,0,.5)",
                          fontWeight: "normal"
                        }
                  }
                >
                  Tab
                </Box>
                <Box style={{ margin: "0 5px" }}>/</Box>
                <Box
                  onClick={() => this.setState({ uiObject: "" })}
                  style={
                    this.state.uiObject !== "tabView"
                      ? {
                          color: "rgba(0,0,0,1)",
                          fontWeight: "bold"
                        }
                      : {
                          color: "rgba(0,0,0,.5)",
                          fontWeight: "normal"
                        }
                  }
                >
                  List
                </Box>
              </Box>
            </Box>
          )}

        {this.props.schema ? (
          <Form
            ref={form => {
              this.form = form;
            }}
            schema={this.props.schema}
            FieldTemplate={FieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={ArrayFieldTemplate}
            showErrorList={false}
            widgets={widgets}
            fields={fields}
            uiSchema={{
              "ui:readonly": true,
              ...this.props.uiSchema,
              "ui:object": this.state.uiObject
            }}
            liveValidate={false}
            noValidate={true}
            onError={() => {}}
            formData={this.props.formData}
            onBlur={() => {}}
            onChange={this.props.onChange}
            onSubmit={this.props.onSubmit}
            formContext={{
              tabView: this.state.uiObject === "tabView",
              readonlyPreview: true,
              isPublished: this.props.isPublished
            }}
          >
            {this.props.children}
          </Form>
        ) : null}
      </Box>
    );
  }
}

JSONShemaPreviewer.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  schemaType: PropTypes.object,
  isPublished: PropTypes.bool,
  displayViewButtons: PropTypes.bool
};

export default JSONShemaPreviewer;
