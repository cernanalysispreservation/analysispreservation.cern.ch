import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

// Customized RJSF component ( Grommet )
import FieldTemplate from "./themes/grommet-preview/templates/FieldTemplate";
import ObjectFieldTemplate from "./themes/grommet-preview/templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./themes/grommet-preview/templates/ArrayFieldTemplate";

import widgets from "./themes/grommet-preview/widgets";
import fields from "./themes/grommet-preview/fields";
import Form from "react-jsonschema-form";

class JSONShemaPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      fields: []
    };
  }

  render() {
    return (
      <Box>
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
            uiSchema={this.props.uiSchema ? this.props.uiSchema : {}}
            liveValidate={false}
            noValidate={true}
            onError={() => {}}
            formData={this.props.formData}
            onBlur={() => {}}
            onChange={this.props.onChange}
            onSubmit={this.props.onSubmit}
            formContext={{
              updateFields: item => this.props.updateFields(item)
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
  updateFields: PropTypes.func
};

export default JSONShemaPreviewer;
