import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Meter from "grommet/components/Meter";
import { AiFillCheckCircle } from "react-icons/ai";

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
        responsive={false}
      >
        <Box flex={true}>{this.props.file.key}</Box>
        <Box flex={false}>
          {_progress == 100 ? (
            <Box flex={false} direction="row" wrap={false} align="center" responsive={false}>
              <span style={{ paddingRight: "5px" }}>File uploaded</span>
              <AiFillCheckCircle size={15} color="rgb(96,143,68)" />
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
  uploadFile: PropTypes.func,
  file: PropTypes.object
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
