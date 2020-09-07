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

    this.state = {
      formData: {},
      uiObject: "tabView"
    };
  }

  render() {
    return (
      <Box
        flex={true}
        pad={{ horizontal: "small" }}
        style={{ position: "relative", height: "1px" }}
      >
        {!this.props.draft && (
          <Box
            direction="row"
            justify="end"
            style={{ position: "absolute", right: "26px" }}
          >
            <Button
              margin={{ left: "medium" }}
              pad={{ vertical: "small", horizontal: "small" }}
              text="List"
              icon={<AiOutlineUnorderedList size={15} />}
              onClick={() => {
                this.setState({ uiObject: "" });
              }}
              background={
                this.props.draft
                  ? "#fff"
                  : this.state.uiObject === ""
                    ? "rgba(146,109,146,1)"
                    : "#f5f5f5"
              }
              color={this.state.uiObject === "" ? "#f9f0ff" : "#000"}
              primary={this.props.draft && this.state.uiObject === ""}
            />

            <Button
              margin={{ left: "medium" }}
              text="Tab"
              pad={{ vertical: "small", horizontal: "small" }}
              onClick={() => this.setState({ uiObject: "tabView" })}
              icon={<FaRegListAlt size={15} />}
              background={
                this.props.draft
                  ? "#fff"
                  : this.state.uiObject === "tabView"
                    ? "rgba(146,109,146,1)"
                    : "#f5f5f5"
              }
              color={this.state.uiObject === "tabView" ? "#f9f0ff" : "#000"}
              primary={this.props.draft && this.state.uiObject === "tabView"}
            />
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
              publishedPreview: true
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
  schemaType: PropTypes.object
};

export default JSONShemaPreviewer;
