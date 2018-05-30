import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Button,
  FormField,
  Anchor,
  CheckBox,
  Paragraph,
  Sidebar,
  Select,
  Title
} from 'grommet';

import AddIcon from 'grommet/components/icons/base/Add';

import {
  toggleFilemanagerLayer,
  initDraft
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

    this.props.initDraft(schema, data.formData )
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
            <Title>Start Your Project</Title>
            <Paragraph>Give a name to your project..This way you can recognise it between your drafts</Paragraph>
            <Paragraph>{this.props.match.params.schema_id}</Paragraph>
            <Form schema={{type: "string", title: "Project Name"}} onSubmit={this._onSubmit.bind(this, this.props.match.params.schema_id)} >
              <Box flex={true} margin={{vertical: "medium"}}>
                <Button label='Start Project'
                  type='submit'
                  primary={true} />
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
    initDraft: (schema, title) => dispatch(initDraft(schema, title))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSidebar));
