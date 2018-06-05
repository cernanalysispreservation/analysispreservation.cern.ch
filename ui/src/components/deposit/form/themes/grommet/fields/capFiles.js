import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
  Box,
  Select
} from 'grommet';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Anchor from 'grommet/components/Anchor';
import Layer from 'grommet/components/Layer';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

import FieldHeader from '../components/FieldHeader';
import Edit from 'grommet/components/icons/base/FormEdit';
import { toggleFilemanagerLayer } from '../../../../../../actions/drafts';

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false,
      selected: {}
    };
  }

  _toggleLayer() { this.setState(prevState => ({layerActive: !prevState.layerActive})); }

  _selectItem(item) { this.setState({selected: item}); }

  _saveSelection() {
    this.setState(
      prevState => ({layerActive: !prevState.layerActive}),
      () => this.props.onChange(this.state.selected)
    );
  }

  _onChange ({target, option, value}) { this.props.onChange(value) }

  _toggleFileManager() { this.props.toggleFilemanagerLayer(true, this.props.onChange) }

  render() {
    const files_list = Object.keys(this.props.files.toJS());

    return (
      <Box pad={{horizontal: "medium", vertical: "small"}} flex={true} direction="row" justify="between" wrap={false}>
        <Box colorIndex="light-2" pad="small" flex={true} direction="row" alignContent="center" align="center" justify="center" wrap={false}>
          {
            this.props.formData ?
            [
              <span>{this.props.formData}</span>,
              <Anchor icon={<Edit />} onClick={this._toggleFileManager.bind(this)} />
            ] :
            [
              <Anchor label="Open File Manager" onClick={this._toggleFileManager.bind(this)}/>,
              <Box>  -- OR --  </Box>,
              <Box>Drag & Drop files here</Box>
            ]
          }
        </Box>
      </Box>
    );
  }
}

ImportDataField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  onChange: PropTypes.func,
  properties: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    files: state.drafts.getIn(['current_item', 'files'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: (selectable=false, action) => dispatch(toggleFilemanagerLayer(selectable, action)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportDataField);