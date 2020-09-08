import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

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
      <React.Fragment>
        <Box
          direction="row"
          justify="between"
          align="center"
          pad={{ vertical: "small", horizontal: "medium" }}
          separator="bottom"
          margin={{ bottom: "large" }}
        >
          <Box direction="row" align="center" justify="center">
            <Heading tag="h3" margin="none">
              Metadata
            </Heading>
            {this.props.tags}
          </Box>
          <Box direction="row">
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
          <Box direction="row">
            {this.props.editAnchor}
            {this.props.reviewAnchor}
          </Box>
        </Box>
        <Box flex={true} pad={{ horizontal: "small" }}>
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
                tabView: this.state.uiObject === "tabView"
              }}
            >
              {this.props.children}
            </Form>
          ) : null}
        </Box>
      </React.Fragment>
    );
  }
}

JSONShemaPreviewer.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};

export default JSONShemaPreviewer;
