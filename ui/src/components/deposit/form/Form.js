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

class DepositForm extends React.Component {
  constructor(props) {
    super(props);
  }

  _validate(formData, errors) {
    return errors;
  }

  render() {
    return (
      <Box size={{width: {min: "large"}}} flex={true}  wrap={false}>
        <SectionHeader label="Submission Form" />
        <Box alignContent="center" justify="center" align="center" flex={true} wrap={false}>
          <Box size="xlarge"  pad="large" flex={false} wrap={false}>
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
                onChange={this.props.onChange}>
                <span />
              </Form>
          </Box>
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
  validate: PropTypes.bool,
  liveValidate: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  formData: PropTypes.object,
  customValidation: PropTypes.bool,
  schemas: PropTypes.object,
  onChange: PropTypes.func
};

function mapStateToProps(state) {
  return {
    showSidebar: state.drafts.get('showSidebar'),
    customValidation: state.drafts.get('customValidation'),
    liveValidate: state.drafts.get('liveValidate'),
    validate: state.drafts.get('validate'),
    data: state.drafts.get('data'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositForm);
