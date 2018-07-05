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

import JSONSchemaPreviewer from '../deposit/form/JSONSchemaPreviewer';
import DepositHeader from '../deposit/components/DepositHeader';
import Sidebar from '../deposit/components/DepositSidebar';

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


export class DraftPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params.draft_id) {
      if (this.props.match.params.draft_id !== this.props.draft_id) {
        this.props.getDraftById(this.props.match.params.draft_id, true);
      }
    }
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
        />
          <Box direction="row" flex={true} wrap={false}>
            <Sidebar draftId={this.props.draft_id} />
            {
              this.props.schema ?
              <Box flex={true}>
                <Box pad="medium" colorIndex="light-2"></Box>
              <Box flex={true}>
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={this.props.formData}
                    schema={_schema}
                    uiSchema={this.props.uiSchema || {}}
                    onChange={(change) => {
                      // console.log("CHANGE::",change);
                      // this.props.formDataChange(change.formData);
                    }}
                  >
                    <span></span>
                  </JSONSchemaPreviewer>
                </Box>
                </Box>
              </Box> : null
            }
          </Box>
      </Box>
    );
  }
}

DraftPreview.propTypes = {};

function mapStateToProps(state) {
  return {
    schema: state.drafts.get('schema'),
    uiSchema: state.drafts.get('uiSchema'),
    draft_id: state.drafts.getIn(['current_item', 'id']),
    draft: state.drafts.getIn(['current_item', 'data']),
    published_id: state.drafts.getIn(['current_item', 'published_id']),
    formData: state.drafts.getIn(['current_item', 'formData'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchema: (schema) => dispatch(fetchSchema(schema)),
    getDraftById: (id, fet) => dispatch(getDraftById(id, fet))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
