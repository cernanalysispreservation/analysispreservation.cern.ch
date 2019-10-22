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
import NoteIcon from "grommet/components/icons/base/Note";
import ImageIcon from "grommet/components/icons/base/Image";
import ServerIcon from "grommet/components/icons/base/Servers";
import PdfIcon from "grommet/components/icons/base/DocumentPdf";
import ZipIcon from "grommet/components/icons/base/DocumentZip";
import LockIcon from "grommet/components/icons/base/FormLock";
import MusicIcon from "grommet/components/icons/base/Music";
import BookIcon from "grommet/components/icons/base/Bookmark";
import D3Icon from "grommet/components/icons/base/3d";
import TextIcon from "grommet/components/icons/base/DocumentText";
import CsvIcon from "grommet/components/icons/base/DocumentCsv";
import HtmlIcon from "grommet/components/icons/base/StandardsHtml5";
import VideoIcon from "grommet/components/icons/base/Video";

import { toggleFilePreviewEdit } from "../../../actions/draftItem";

import { deleteFileByUri } from "../../../actions/files";

const _getIcon = mimetype => {
  if (!mimetype) {
    return <NoteIcon type="status" size="xlarge" />;
  }

  let type, subtype;
  type = mimetype.split("/")[0];
  subtype = mimetype.split("/")[1];

  const typeToIcon = {
    application: {
      "octet-stream": <ServerIcon type="status" size="xlarge" />,
      pdf: <PdfIcon type="status" size="xlarge" />,
      pkcs8: <LockIcon type="status" size="xlarge" />,
      zip: <ZipIcon type="status" size="xlarge" />
    },
    audio: {
      default: <MusicIcon type="small" size="xlarge" />
    },
    font: {
      default: <BookIcon type="status" size="xlarge" />
    },
    image: {
      default: <ImageIcon type="status" size="xlarge" />
    },
    model: {
      default: <D3Icon type="status" size="xlarge" />
    },
    text: {
      plain: <TextIcon type="status" size="xlarge" />,
      csv: <CsvIcon type="status" size="xlarge" />,
      html: <HtmlIcon type="status" size="xlarge" />
    },
    video: {
      default: <VideoIcon type="status" size="xlarge" />
    }
  };

  if (typeToIcon[type][subtype]) {
    return typeToIcon[type][subtype];
  } else if (typeToIcon[type]["default"]) {
    return typeToIcon[type]["default"];
  } else {
    return <NoteIcon type="status" size="xlarge" />;
  }
};

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
  file_link = file_link ? file_link.replace("/files/", "/api/files/") : null;

  if (open) return null;
  return (
    <Layer closer={true} align="right" overlayClose={true} onClose={toggle}>
      <Box pad="large" flex={true} direction="column" align="center">
        <Heading tag="h4">{file.key}</Heading>
        <Box margin={{ vertical: "large" }}>{_getIcon(file.mimetype)}</Box>
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
