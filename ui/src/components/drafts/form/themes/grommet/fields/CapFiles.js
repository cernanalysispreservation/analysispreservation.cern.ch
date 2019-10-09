import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

import Edit from "grommet/components/icons/base/FormEdit";
import { toggleFilemanagerLayer } from "../../../../../../actions/draftItem";

class CapFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false,
      selected: {}
    };
  }

  _toggleLayer() {
    this.setState(prevState => ({ layerActive: !prevState.layerActive }));
  }

  _selectItem(item) {
    this.setState({ selected: item });
  }

  _saveSelection() {
    this.setState(
      prevState => ({ layerActive: !prevState.layerActive }),
      () => this.props.onChange(this.state.selected)
    );
  }

  _onChange({ value }) {
    this.props.onChange(value);
  }

  _toggleFileManager() {
    this.props.toggleFilemanagerLayer(true, this.props.onChange);
  }

  render() {
    return (
      <Box
        pad="small"
        flex={true}
        direction="row"
        alignContent="center"
        align="center"
        justify="center"
        wrap={false}
      >
        {this.props.formData ? (
          <React.Fragment>
            <span>{this.props.formData}</span>
            <Anchor
              icon={<Edit />}
              onClick={this._toggleFileManager.bind(this)}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Anchor
              label="Open File Manager"
              onClick={this._toggleFileManager.bind(this)}
            />
          </React.Fragment>
        )}
      </Box>
    );
  }
}

CapFile.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  onChange: PropTypes.func,
  properties: PropTypes.object,
  toggleFilemanagerLayer: PropTypes.func,
  formData: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: (selectable = false, action) =>
      dispatch(toggleFilemanagerLayer(selectable, action))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(CapFile);
