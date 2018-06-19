import _ from 'lodash';
import React from 'react';

import {connect} from 'react-redux';

import {Box, Toast} from 'grommet';

import {
  fetchSchema,
  createDraft,
  initForm,
  formDataChange,
  getDraftById,
  publishDraft,
  deleteDraft,
  updateDraft,
  discardDraft,
  editPublished
} from '../../actions/drafts';

import DepositForm from '../deposit/form/Form';
import DepositHeader from '../deposit/components/DepositHeader';
import Sidebar from '../deposit/components/DepositSidebar';
import Previewer from '../deposit/components/DepositPreviewer';

const transformSchema = (schema) => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "control_number"
  ];

  schema.properties = _.omit(schema.properties, schemaFieldsToRemove);
  schema = { type: schema.type, properties: schema.properties,  dependencies: schema.dependencies,  };
  return schema;
};


export class CreateDeposit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params.draft_id) {
      if (this.props.match.params.draft_id !== this.props.draft_id) {
        this.props.getDraftById(this.props.match.params.draft_id, true);
      }
    }
    if (this.props.match.params.schema_id) {
      this.props.initForm();
      this.props.fetchSchema(this.props.match.params.schema_id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.draft_id) {
      if (nextProps.match.params.draft_id !== nextProps.draft_id) {
        // nextProps.getDraftById(nextProps.match.params.draft_id, true);
      }
    }
    return true
  }

  _saveData() {
    if (this.props.draft_id && !this.props.published_id)
      this.props.updateDraft({ ...this.props.formData }, this.props.draft_id);
    else if (this.props.match.params.schema_id)
      this.props.createDraft(this.props.formData, this.props.match.params.schema_id);
    else if (this.props.published_id && this.props.draft_id)
      this.props.editPublished({ ...this.props.formData, $schema: this.props.draft.$schema }, this.props.match.params.schema_id, this.props.draft_id);
  }

  _publishData() {
    this.props.publishDraft(this.props.draft_id);
  }

  _deleteDraft() {
    this.props.deleteDraft(this.props.draft_id);
  }

  _discardData() {
    this.props.discardDraft(this.props.draft_id);
  }

  render() {
    let _schema = this.props.schema ? transformSchema(this.props.schema):null;
    return (
      <Box id="deposit-page"  flex={true}>
        {
          this.props.error?
          <Toast status="critical">
            {this.props.error.message}
          </Toast> : null
        }
        <DepositHeader
          draftId={this.props.draft_id}
          saveData={this._saveData.bind(this)}
          publishData={this._publishData.bind(this)}
          deleteDraft={this._deleteDraft.bind(this)}
          discardData={this._discardData.bind(this)}
        />
          <Box direction="row" justify="between" flex={true} wrap={false}>
            <Sidebar draftId={this.props.draft_id} />
            {
              this.props.schema ?
              <DepositForm
                formData={this.props.formData}
                schema={_schema}
                uiSchema={this.props.uiSchema || {}}
                onChange={(change) => {
                  // console.log("CHANGE::",change);
                  this.props.formDataChange(change.formData);
                }}
              /> : null
            }
            <Previewer data={this.props.formData || {}}/>
          </Box>
      </Box>
    );
  }
}

CreateDeposit.propTypes = {};

function mapStateToProps(state) {
  return {
    schema: state.drafts.get('schema'),
    uiSchema: state.drafts.get('uiSchema'),
    error: state.drafts.getIn(['current_item', 'error']),
    draft_id: state.drafts.getIn(['current_item', 'id']),
    draft: state.drafts.getIn(['current_item', 'data']),
    published_id: state.drafts.getIn(['current_item', 'published_id']),
    formData: state.drafts.getIn(['current_item', 'formData'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchema: (schema) => dispatch(fetchSchema(schema)),
    createDraft: (data, schema) => dispatch(createDraft(data, schema)),
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    getDraftById: (id, fet) => dispatch(getDraftById(id, fet)),
    initForm: () => dispatch(initForm()),
    publishDraft: (draft_id) => dispatch(publishDraft(draft_id)),
    deleteDraft: (draft_id) => dispatch(deleteDraft(draft_id)),
    discardDraft: (draft_id) => dispatch(discardDraft(draft_id)),
    editPublished: (data, schema, draft_id) => dispatch(editPublished(data, schema, draft_id)),
    formDataChange: (data) => dispatch(formDataChange(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDeposit);
