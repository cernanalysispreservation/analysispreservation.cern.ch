import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import objectPath from "object-path";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet/templates/FieldTemplate";
import ObjectFieldTemplate from "./themes/grommet/templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./themes/grommet/templates/ArrayFieldTemplate";
import ErrorListTemplate from "./themes/grommet/templates/ErrorListTemplate";

import SectionHeader from "../components/SectionHeader";

import widgets from "./themes/grommet/widgets";
import fields from "./themes/grommet/fields";

import Form from "react-jsonschema-form";

class DepositForm extends React.Component {
  constructor(props) {
    super(props);
  }

  _validate(formData, errors) {
    this.props.errors.map(error => {
      if (error.field) {
        let errorObj = objectPath.get(errors, error.field);
        errorObj.addError(error.message);
      }
    });
    console.log("valisdateee", errors, this.props.errors);
    return errors;
  }

  transformErrors(errors) {
    errors.map(error => {
      error.name = error.property;

      if (error.message == "should be string") {
        let errorMessages = objectPath.get(this.props.formData, error.property);
        if (errorMessages == undefined) error.message = "Either edit or remove";
      }

      let objPath = error.property.slice(1).split(".");
      objPath.map((path, index) => {
        let _path = objPath.slice(0, index + 1);
        if (objPath.length == index + 1) return;

        const re = new RegExp("\\[.*?]");
        let isArray = re.test(path);
        if (isArray) {
          let arrayPathname, arrayPath;

          arrayPathname = path.split("[", 1);
          arrayPath = objPath.slice(0, index);
          arrayPath.push(arrayPathname[0]);

          errors.push({ property: "." + arrayPath.join(".") });
        }

        // *** Uncomment following lines if you want to add error
        // *** propagation only for the first level (not nested ones)
        // index == 0 ?
        errors.push({ property: "." + _path.join(".") });
        //: null;
      });
      return error;
    });
    return errors;
  }

  render() {
    let __uiSchema = {
      ...this.props.uiSchema,
      "ui:options": {
        display: "flex",
        size: "large",
        align: "center"
      }
    };

    return (
      <Box size={{ width: { min: "large" } }} flex={true} wrap={false}>
        <SectionHeader label="Submission Form" />
        <Box pad="none" flex={true}>
          <Form
            ref={this.props.formRef}
            style={{ marginBottom: "1em" }}
            schema={this.props.schema}
            FieldTemplate={FieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={ArrayFieldTemplate}
            showErrorList={true}
            ErrorList={ErrorListTemplate}
            widgets={widgets}
            fields={fields}
            uiSchema={__uiSchema || this.props.uiSchema}
            liveValidate={false}
            noValidate={false}
            validate={this._validate.bind(this)}
            onError={() => {}}
            transformErrors={this.transformErrors.bind(this)}
            formData={this.props.formData}
            onBlur={() => {}}
            onChange={this.props.onChange}
          >
            <span />
          </Form>
        </Box>
      </Box>
    );
  }
}

DepositForm.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.object,
  selectSchema: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  formData: PropTypes.object,
  schemas: PropTypes.object,
  onChange: PropTypes.func
};

export default DepositForm;
