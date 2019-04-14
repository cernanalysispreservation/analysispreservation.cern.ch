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
    return errors;
  }

  render() {
    return (
      <Form
        ref={form => {
          this.form = form;
        }}
        schema={this.props.schema}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        showErrorList={
          this.props.showErrorList ? this.props.showErrorList : false
        }
        ErrorList={ErrorListTemplate}
        widgets={widgets}
        fields={fields}
        uiSchema={this.props.uiSchema}
        liveValidate={this.props.liveValidate}
        noValidate={!this.props.validate}
        validate={this.props.customValidation ? this._validate : null}
        onError={() => {}}
        formData={this.props.formData}
        onBlur={this.props.onBlur}
        onChange={this.props.onChange}
        onSubmit={this.props.onSubmit}
      >
        {this.props.children || <span />}
      </Form>
    );
  }
}

GrommetForm.propTypes = {
  schema: PropTypes.object.isRequired,
  validate: PropTypes.bool,
  liveValidate: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  customValidation: PropTypes.bool,
  showErrorList: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};

export default GrommetForm;
