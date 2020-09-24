import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import { connect } from "react-redux";
import Anchor from "../../../../../partials/Anchor";

import { AiOutlineDownload } from "react-icons/ai";

class CapField extends React.Component {
  render() {
    if (!this.props.formData) return <Box>-</Box>;

    let link;    
    let file = this.props.files.get(this.props.formData);
    let bucket_id = file ? file.bucket : null;
     link = this.props.formContext.isPublished?`/api/files/${bucket_id}/${this.props.formData}`:`${this.props.links.bucket}/${this.props.formData}`;
    return (
      <Box style={{ wordBreak: "break-all" }} justify="center" flex={true}>
        <Anchor
          href={link}
          download
        >
          <Box direction="row" responsive={false} align="center">
            <AiOutlineDownload />
            <Box style={{ marginLeft: "5px" }}>{this.props.formData}</Box>
          </Box>
        </Anchor>
      </Box>
    );
  }
}

CapField.propTypes = {
  formData: PropTypes.object,
  formContext: PropTypes.object,
  links: PropTypes.object,
  files: PropTypes.object
};

const mapStateToProps = (state) => ({
  links: state.draftItem.get("links"),
  files: state.published.get("files")
});

export default connect(
  mapStateToProps,
  null
)(CapField);
