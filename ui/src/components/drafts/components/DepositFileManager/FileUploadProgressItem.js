import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Meter from "grommet/components/Meter";

class FileUploadProgressItem extends React.Component {
  render() {
    if (!this.props.file) return null;
    return (
      <Box
        style={{ padding: "4px 10px", marginBottom: "7px" }}
        direction="row"
        align="center"
        justify="between"
        separator="all"
      >
        <Box flex={true}>{this.props.file.key}</Box>
        <Box flex={false}>
          <Meter value={this.props.file.progress * 100} />
        </Box>
      </Box>
    );
  }
}

FileUploadProgressItem.propTypes = {
  links: PropTypes.object,
  uploadFile: PropTypes.func
};

function mapStateToProps(state, props) {
  return {
    // links: state.draftItem.get("links"),
    file: state.draftItem.getIn(["uploadFiles", props.file_key])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploadProgressItem);
