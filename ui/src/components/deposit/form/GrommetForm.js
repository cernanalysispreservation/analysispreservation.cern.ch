import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
  Box
} from 'grommet';

import {toggleFilemanagerLayer} from '../../../actions/drafts';

// Customized RJSF component ( Grommet )
import FieldTemplate from './themes/grommet/templates/FieldTemplate';
import ObjectFieldTemplate from './themes/grommet/templates/ObjectFieldTemplate';
import ArrayFieldTemplate from './themes/grommet/templates/ArrayFieldTemplate';
import ErrorListTemplate from './themes/grommet/templates/ErrorListTemplate';

import SectionHeader from '../components/SectionHeader';

import widgets from './themes/grommet/widgets';
import fields from './themes/grommet/fields';

import Form from "react-jsonschema-form";

import AvailableDeposits from '../components/AvailableDeposits';

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
        ref={(form) => {this.form=form;}}
        schema={this.props.schema}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        showErrorList={true}
        ErrorList={ErrorListTemplate}
        widgets={widgets}
        fields={fields}
        uiSchema={this.props.uiSchema}
        liveValidate={this.props.liveValidate}
        noValidate={!this.props.validate}
        validate={this.props.customValidation ? this._validate : null}
        onError={({e}) => console.log("onError::::", e)}
        formData={this.props.formData}
        onBlur={({type}) => console.log("onBlur::::", type)}
        onChange={this.props.onChange}
        onSubmit={this.props.onSubmit}>
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
  onChange: PropTypes.func
};

export default GrommetForm;
