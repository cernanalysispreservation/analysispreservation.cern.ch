import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Layer from "grommet/components/Layer";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import Button from "grommet/components/Button";

import CloseIcon from "grommet/components/icons/base/Close";
import DownloadIcon from "grommet/components/icons/base/Download";

import { toggleFilePreviewEdit } from "../../../actions/draftItem";

import { deleteFileByUri } from "../../../actions/files";
import GetIcon from "./getIcon";

const formatted_date = time =>
  time.getFullYear() +
  "-" +
  (time.getMonth() + 1) +
  "-" +
  time.getDate() +
  " " +
  time.getHours() +
  ":" +
  time.getMinutes();

const PreviewUpload = ({ file, open, toggle, deleteFile }) => {
  let { links: { self: file_link = null } = {}, key: filePath } = file;

  if (open) return null;
  return (
    <Layer closer={true} align="right" overlayClose={true} onClose={toggle}>
      <Box pad="large" flex={true} direction="column" align="center">
        <Heading tag="h4">{file.key}</Heading>
        <Box margin={{ vertical: "large" }}>{GetIcon(file.mimetype)}</Box>
        <Heading tag="h4" style={{ letterSpacing: "3px" }}>
          Tags
        </Heading>
        <Box align="start">
          <Paragraph>
            Created: {formatted_date(new Date(file.created))}
          </Paragraph>
          <Paragraph>
            Last Update: {formatted_date(new Date(file.updated))}
          </Paragraph>
        </Box>
        <Box direction="row">
          <Box pad="medium">
            <Button
              label="Download"
              size="medium"
              primary
              icon={<DownloadIcon size="small" />}
              onClick={() => {}}
              href={file_link}
              download
            />
          </Box>
          <Box pad="medium">
            <Button
              label="Delete"
              size="medium"
              critical={true}
              secondary
              icon={<CloseIcon size="small" />}
              onClick={() => {
                toggle();
                deleteFile(file_link, filePath);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

const mapStateToProps = state => ({
  file: state.draftItem.get("filePreviewEdit"),
  open: state.draftItem.get("filePreviewEditLayer")
});

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => dispatch(toggleFilePreviewEdit()),
    deleteFile: (file_uri, filepath) =>
      dispatch(deleteFileByUri(file_uri, filepath))
  };
};

PreviewUpload.propTypes = {
  open: PropTypes.bool,
  file: PropTypes.object,
  deleteFile: PropTypes.func,
  toggle: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewUpload);
