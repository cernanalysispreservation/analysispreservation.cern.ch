import React from 'react';

import {connect} from 'react-redux';

import {
  Box
} from 'grommet';

// Customized RJSF component ( Grommet )
import FieldTemplate from './themes/grommet-preview/templates/FieldTemplate';
import ObjectFieldTemplate from './themes/grommet-preview/templates/ObjectFieldTemplate';
import ArrayFieldTemplate from './themes/grommet-preview/templates/ArrayFieldTemplate';
import ErrorListTemplate from './themes/grommet-preview/templates/ErrorListTemplate';


import widgets from './themes/grommet-preview/widgets';
import fields from './themes/grommet-preview/fields';

import Form from "react-jsonschema-form";

class JSONShemaPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {}
    };
  }

  render() {
    return (
          <Box size="xlarge" flex={true} wrap={false}>
            {
              this.props.schema ?
              <Form
                ref={(form) => {this.form=form;}}
                schema={this.props.schema}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                ArrayFieldTemplate={ArrayFieldTemplate}
                showErrorList={true}
                ErrorList={ErrorListTemplate}
                widgets={widgets}
                fields={fields}
                uiSchema={this.props.uiSchema ? this.props.uiSchema : {}}
                liveValidate={false}
                noValidate={true}
                onError={(e) => console.log("errors", e)}
                formData={this.props.formData}
                onBlur={(type) => {
                  console.log("onBlur::::",type);
                  // this.setState({formData: change.formData})
                }}
                onChange={this.props.onChange}
                onSubmit={this.props.onSubmit}>
                {this.props.children}
              </Form> : null
            }
          </Box>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JSONShemaPreviewer);