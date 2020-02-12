import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Meter from "grommet/components/Meter";
import Status from "grommet/components/icons/Status";

class FileUploadProgressItem extends React.Component {
  render() {
    if (!this.props.file) return null;

    let _progress = this.props.file.progress * 100;
    return (
      <Box
        style={{ padding: "4px 10px", marginBottom: "7px" }}
        direction="row"
        align="center"
        justify="between"
        separator="all"
        pad={{ between: "small" }}
      >
        <Box flex={true}>{this.props.file.key}</Box>
        <Box flex={false}>
          {_progress == 100 ? (
            <Box flex={false} direction="row" wrap={false} align="center">
              <span style={{ paddingRight: "5px" }}>File uploaded</span>
              <Status value="ok" size="xsmall" />
            </Box>
          ) : (
            <Meter value={_progress} />
          )}
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
