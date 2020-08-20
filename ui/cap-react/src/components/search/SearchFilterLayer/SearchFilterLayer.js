import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Modal from "../../partials/Modal";
class SearchFilterLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.active) {
      return (
        <Modal
          background="#f5f5f5"
          full
          onClose={this.props.onClose}
          position="left"
        >
          <Box justify="center" align="center" colorIndex="light-2">
            {this.props.properties}
          </Box>
        </Modal>
      );
    } else return null;
  }
}

SearchFilterLayer.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  properties: PropTypes.node
};

export default SearchFilterLayer;
