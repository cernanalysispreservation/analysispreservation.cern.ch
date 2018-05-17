import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
  Anchor,
  Box,
  Button,
  Header,
  Menu
} from 'grommet';

import SplitIcon from 'grommet/components/icons/base/Split';
import SplitsIcon from 'grommet/components/icons/base/Splits';
import SaveIcon from 'grommet/components/icons/base/Save';
import ShareIcon from 'grommet/components/icons/base/Share';
import TrashIcon from 'grommet/components/icons/base/Trash';
import RefreshIcon from 'grommet/components/icons/base/Refresh';

import { togglePreviewer, toggleSidebar } from '../../../actions/drafts';

class DepositHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header flex={true} size="small" pad="none" colorIndex="neutral-1-a">
        <Box flex={true}  direction="row" justify="between" align="center">
          <Box pad="small">{this.props.draftId} - {this.props.selectedSchema}</Box>
          <Box align="center" flex={true} >{(this.props.selectedSchema)}</Box>
          <Box colorIndex="neutral-1-a" direction="row">
            <Menu responsive={true}
              label="Layout"
              size="small"
              inline={false}>
              <Anchor icon={<SplitIcon/>} onClick={this.props.showPreviewer} />
              <Anchor icon={<SplitsIcon/>} onClick={this.props.showSidebar} />
            </Menu>
            <Button
              icon={<SaveIcon/>}
              plain={true}
              primary={true}
              label="Save"
              onClick={this.props.saveData}
            />
            <Button
              icon={<ShareIcon/>}
              plain={true}
              secondary={true}
              label="Share"
              onClick={this.props.draft_id ? this.props.publishData: null}
            />
            <Button 
              label="Delete"
              icon={<TrashIcon/>}
              onClick={this.props.draft_id ? this.props.deleteDraft: null}
              primary={true}
            />
            <Button
              icon={<RefreshIcon/>}
              plain={true}
              secondary={true}
              label="Discard"
              onClick={this.props.discardData}
            />
          </Box>
        </Box>
      </Header>
    );
  }
}

DepositHeader.propTypes = {
  selectedSchema: PropTypes.string,
  showPreviewer: PropTypes.func,
  saveData: PropTypes.func,
  publishData: PropTypes.func,
  showSidebar: PropTypes.func
};

function mapStateToProps(state) {
  return {
    selectedSchema: state.drafts.get("selectedSchema"),
    draft_id: state.drafts.getIn(['current_item', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showPreviewer: () => dispatch(togglePreviewer()),
    showSidebar: () => dispatch(toggleSidebar())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositHeader);