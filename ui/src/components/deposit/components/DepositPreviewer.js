import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
  Box,
  Sidebar
} from 'grommet';

import UploadIcon from 'grommet/components/icons/base/Upload';

import ReactJson from 'react-json-view';

import {toggleFilemanagerLayer} from '../../../actions/drafts';

import SectionHeader from './SectionHeader';

class DepositPreviewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.showPreviewer ?
      <Sidebar full={false} size="large" colorIndex="light-2">
        <Box flex={true}>
          <SectionHeader label="Previewer" icon={<UploadIcon />} />
          <Box pad="small" flex={true}>
            <ReactJson src={this.props.data} />
          </Box>
        </Box>
      </Sidebar> : null;
  }
}

DepositPreviewer.propTypes = {
  showPreviewer: PropTypes.bool,
  data: PropTypes.object
};

function mapStateToProps(state) {
  return {
    showPreviewer: state.drafts.get("showPreviewer")
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
)(DepositPreviewer);
