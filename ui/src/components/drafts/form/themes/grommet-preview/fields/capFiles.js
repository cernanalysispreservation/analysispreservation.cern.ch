import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

import Edit from "grommet/components/icons/base/FormEdit";
import { toggleFilemanagerLayer } from "../../../../../../actions/drafts";

class ImportDataField extends React.Component {
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
        pad={{ horizontal: "medium", vertical: "small" }}
        flex={true}
        direction="row"
        justify="between"
        wrap={false}
      >
        <Box
          colorIndex="light-2"
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
              <span>{this.props.formData}</span>,
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
              />,
              <Box> -- OR -- </Box>,
              <Box>Drag & Drop files here</Box>
            </React.Fragment>
          )}
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
  toggleFilemanagerLayer: PropTypes.func,
  formData: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: (selectable = false, action) =>
      dispatch(toggleFilemanagerLayer(selectable, action))
  };
}

export default connect(mapDispatchToProps)(ImportDataField);
