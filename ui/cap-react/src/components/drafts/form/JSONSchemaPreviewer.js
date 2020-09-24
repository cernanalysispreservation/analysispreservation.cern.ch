import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaRegListAlt } from "react-icons/fa";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet-preview/templates/FieldTemplate";
import ArrayFieldTemplate from "./themes/grommet/templates/ArrayFieldTemplate";

import ObjectFieldTemplate from "./themes/grommet/templates/ObjectFieldTemplate";

import widgets from "./themes/grommet-preview/widgets";
import fields from "./themes/grommet-preview/fields";
import Form from "react-jsonschema-form";

import Button from "../../partials/Button";

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
      uiObject: this.props.draft ? "" : (shouldDisplayTabViewButton ? "tabView" : ""),
      uiAvailableList: shouldDisplayTabViewButton
        ? [
            {
              text: "Tab",
              id: "tabView",
              value: "tabView",
              icon: <FaRegListAlt size={15} />
            },
            {
              text: "List",
              id: "listView",
              value: "",
              icon: <AiOutlineUnorderedList size={15} />
            }
          ]
        : [
            {
              text: "List",
              id: "listView",
              value: "",
              icon: <AiOutlineUnorderedList size={15} />
            }
          ]
    };
  }

  render() {
    return (
      <Box
        flex={true}
        pad={{ horizontal: "small" }}
        style={{ position: "relative", height: "1vh" }}
      >
        {!this.props.draft && (
          <Box
            direction="row"
            justify="end"
            style={{ position: "absolute", right: "26px" }}
          >
            {this.state.uiAvailableList.map((item, index) => (
              <Button
                margin="0 10px"
                key={index}
                text={item.text}
                icon={item.icon}
                background={
                  this.state.uiObject === item.value
                    ? "rgba(146,109,146,1)"
                    : "#f5f5f5"
                }
                hoverColor={
                  this.state.uiObject === item.value
                    ? "rgba(146,109,146,.8)"
                    : "#e6e6e6"
                }
                color={this.state.uiObject === item.value ? "#f9f0ff" : "#000"}
                onClick={() => {
                  this.setState({ uiObject: item.value });
                }}
              />
            ))}
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
  isPublished: PropTypes.bool
};

export default JSONShemaPreviewer;
