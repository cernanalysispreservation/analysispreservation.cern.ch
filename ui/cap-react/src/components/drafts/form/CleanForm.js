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

class CleanForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {}
    };
  }

  render() {
    return this.props.schema ? (
      <Form
        ref={this.props.formRef}
        schema={this.props.schema}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        showErrorList={this.props.showErrorList || false}
        ErrorList={ErrorListTemplate}
        widgets={widgets}
        fields={fields}
        // tagName="div"
        uiSchema={this.props.uiSchema ? this.props.uiSchema : {}}
        liveValidate={this.props.liveValidate || false}
        noValidate={false}
        onError={() => {}}
        formData={this.props.formData}
        onBlur={() => {}}
        onChange={this.props.onChange}
        noHtml5Validate={true}
        onSubmit={this.props.onSubmit}
      >
        {this.props.children}
      </Form>
    ) : null;
  }
}

CleanForm.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.array,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.object,
  showErrorList: PropTypes.bool,
  liveValidate: PropTypes.bool,
  formRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default CleanForm;
