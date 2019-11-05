import React from "react";
import PropTypes from "prop-types";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet/templates/FieldTemplate";
import ObjectFieldTemplate from "./themes/grommet/templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./themes/grommet/templates/ArrayFieldTemplate";
import ErrorListTemplate from "./themes/grommet/templates/ErrorListTemplate";

import widgets from "./themes/grommet/widgets";
import fields from "./themes/grommet/fields";

import Form from "react-jsonschema-form";

class GrommetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {}
    };
  }

  _validate(formData, errors) {
    if (!this.props.errors && !Array.isArray(this.props.errors)) return errors;

    this.props.errors.map(error => {
      if (error.field) {
        let errorObj = objectPath.get(errors, error.field);
        errorObj.addError(error.message);
      }
    });

    return errors;
  }

  render() {
    return this.props.schema ? (
      <Form
        className={this.props.condenced ? "rjsf-condenced" : null}
        style={{ marginBottom: "1em", ...this.props.styles }}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        ErrorList={ErrorListTemplate}
        widgets={widgets}
        fields={fields}
        onError={error => {
          console.log("onErorr:::", error);
        }}
        ref={this.props.formRef}
        schema={this.props.schema}
        uiSchema={this.props.uiSchema}
        showErrorList={!this.props.hideErrorList}
        noHtml5Validate={true}
        formData={this.props.formData}
        onBlur={this.props.onBlur}
        onChange={this.props.onChange}
        onSubmit={this.props.onSubmit}
      >
        {this.props.children || <span />}
      </Form>
    ) : null;
  }
}

GrommetForm.propTypes = {
  errors: PropTypes.array,
  schema: PropTypes.object.isRequired,
  validate: PropTypes.bool,
  liveValidate: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  customValidation: PropTypes.bool,
  showErrorList: PropTypes.bool,
  transformErrors: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};

export default GrommetForm;
