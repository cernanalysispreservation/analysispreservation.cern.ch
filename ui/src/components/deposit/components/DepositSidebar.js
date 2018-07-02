import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Button,
  Anchor,
  Paragraph,
  Sidebar,
  Title
} from 'grommet';

import AddIcon from 'grommet/components/icons/base/Add';

import {
  toggleFilemanagerLayer,
  createDraft
} from '../../../actions/drafts';

import {withRouter} from 'react-router';

import Form from '../form/GrommetForm';
import SectionHeader from './SectionHeader';
import DepositFilesList from './DepositFilesList';

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _onSubmit(schema, data) {
    event.preventDefault();
    let initialData = {general_title: data.formData};
    this.props.createDraft(initialData, schema);
    //this.props.initDraft(schema, data.formData )
  }

  render() {
    return (
      <Sidebar full={false} size="medium" colorIndex="light-2">
        {
          this.props.draftId ?
          <Box flex={true}>
            <SectionHeader
              label="Files | Data | Source Code"
              icon={
                  <Anchor
                    onClick={this.props.toggleFilemanagerLayer}
                    size="xsmall"
                    icon={<AddIcon />} />
                  }
            />
            <DepositFilesList files={this.props.files || []} draftId={this.props.draftId}/>
          </Box> :
          <Box pad="medium">
            <Title>Preserve your analysis</Title>
            <Paragraph>Name it to distinguish it from your other drafts</Paragraph>
            <Form schema={{type: "string", title: "Analysis Name"}} onSubmit={this._onSubmit.bind(this, this.props.match.params.schema_id)} >
              <Box flex={true} margin={{vertical: "medium"}}>
                <Button label='Start Preserving'
                  type='submit'
                  primary={true}
                  color="neutral-1" />
              </Box>
            </Form>
          </Box>
        }
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  schemas: PropTypes.object,
  selectedSchema: PropTypes.string,
  onChangeSchema: PropTypes.func,
  validate: PropTypes.bool,
  toggleValidate: PropTypes.func,
  liveValidate: PropTypes.bool,
  toggleLiveValidate: PropTypes.func,
  customValidation: PropTypes.bool,
  toggleCustomValidation: PropTypes.func
};

function mapStateToProps(state) {
  return {
    showSidebar: state.drafts.get('showSidebar'),
    schema: state.drafts.get('schema'),
    files: state.drafts.getIn(['current_item', 'files']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    createDraft: (schema, title) => dispatch(createDraft(schema, title))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSidebar));
