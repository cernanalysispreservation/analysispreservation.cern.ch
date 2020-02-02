import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";

// import ListItem from "grommet/components/ListItem";

import cogoToast from "cogo-toast";

import Status from "grommet/components/icons/Status";
import NoteIcon from "grommet/components/icons/base/Note";
import CloseIcon from "grommet/components/icons/base/Close";
import DownloadIcon from "grommet/components/icons/base/Download";
// import MoreIcon from "grommet/components/icons/base/More";
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
import Code from "grommet/components/icons/base/Code";
import CSSIcon from "grommet/components/icons/base/StandardsCss3";
import PlatformReactjs from "grommet/components/icons/base/PlatformReactjs";
import Cli from "grommet/components/icons/base/Cli";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toggleFilePreviewEdit } from "../../../actions/draftItem";

import prettyBytes from "pretty-bytes";
import { deleteFileByUri } from "../../../actions/files";

const uploadStatusMap = {
  uploading: "disabled",
  error: "critical",
  done: "ok"
};

class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      menu: false
    };
  }

  _getIcon(mimetype) {
    if (!mimetype) {
      return <NoteIcon type="status" size="xsmall" />;
    }

    let type, subtype;
    type = mimetype.split("/")[0];
    subtype = mimetype.split("/")[1];

    const typeToIcon = {
      application: {
        "octet-stream": <ServerIcon type="status" size="xsmall" />,
        pdf: <PdfIcon type="status" size="xsmall" />,
        pkcs8: <LockIcon type="status" size="xsmall" />,
        zip: <ZipIcon type="status" size="xsmall" />,
        gzip: <ZipIcon type="status" size="xsmall" />,
        "x-sh": <Cli type="status" size="xsmall" />,
        javascript: <PlatformReactjs type="status" size="xsmall" />
      },
      audio: {
        default: <MusicIcon type="small" size="xsmall" />
      },
      font: {
        default: <BookIcon type="status" size="xsmall" />
      },
      image: {
        default: <ImageIcon type="status" size="xsmall" />
      },
      model: {
        default: <D3Icon type="status" size="xsmall" />
      },
      text: {
        plain: <TextIcon type="status" size="xsmall" />,
        csv: <CsvIcon type="status" size="xsmall" />,
        json: <HtmlIcon type="status" size="xsmall" />,
        html: <HtmlIcon type="status" size="xsmall" />,
        css: <CSSIcon type="status" size="xsmall" />,
        "x-python": <Code type="status" size="xsmall" />
      },
      video: {
        default: <VideoIcon type="status" size="xsmall" />
      }
    };

    if (typeToIcon[type][subtype]) {
      return typeToIcon[type][subtype];
    } else if (typeToIcon[type]["default"]) {
      return typeToIcon[type]["default"];
    } else {
      return <NoteIcon type="status" size="xsmall" />;
    }
  }

  showToaster(error) {
    cogoToast.error(error, {
      hideAfter: 3
    });
  }

  _toggleHover = hover => {
    this.setState({ hover });
  };
  _toggleMenu = () => {
    this.setState({ menu: !this.state.menu });
  };
  render() {
    let { file } = this.props;

    let { links: { self: file_link = null } = {}, key: filePath } =
      file.data || file;

    // TO_REMOVE after fixings links from backend
    file_link = file_link ? file_link.replace("/files/", "/api/files/") : null;

    return file ? (
      <Box
        key={file.key}
        pad="none"
        flex={true}
        onMouseOver={() => this._toggleHover(true)}
        onMouseLeave={() => this._toggleHover(false)}
      >
        {file.status == "error" ? this.showToaster(file.error.message) : null}

        <Box direction="row" flex={true} wrap={false}>
          <Box direction="row" flex={true} onClick={this.props.action}>
            <Box justify="center">{this._getIcon(file.mimetype)}</Box>

            <Box
              justify="center"
              flex={true}
              size="small"
              style={{ padding: "0 5px" }}
            >
              <Label
                justify="center"
                margin="none"
                size="small"
                truncate={true}
              >
                {this.props.filename ? this.props.filename : filePath}{" "}
              </Label>
            </Box>
          </Box>

          <Box flex={false} direction="row" justify="end" align="center">
            <span style={{ color: "#aaa" }}>
              {file.size ? prettyBytes(parseInt(file.size)) : null}
            </span>

            <Box justify="center" style={{ width: "9px", marginLeft: "5px" }}>
              {file.status ? (
                <Box
                  colorIndex={uploadStatusMap[file.status]}
                  style={{ width: "9px", borderRadius: "50%", height: "9px" }}
                />
              ) : null}
            </Box>

            {this.state.hover || this.state.menu ? (
              <Box>
                <Box
                  onClick={this._toggleMenu}
                  justify="center"
                  align="center"
                  style={{ padding: "5px 4px 5px 10px" }}
                >
                  {this.state.menu ? (
                    <FaChevronUp style={{ width: "8px" }} />
                  ) : (
                    <FaChevronDown style={{ width: "8px" }} />
                  )}
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>

        {this.state.menu ? (
          <Box colorIndex="light-2" alignSelf="end" pad="small">
            <Anchor
              size="small"
              icon={<DownloadIcon size="xsmall" />}
              label={<Label size="small">Download</Label>}
              href={file_link}
              download
            />
            {this.props.status !== "published" ? (
              <Anchor
                size="small"
                icon={<CloseIcon size="xsmall" />}
                label={<Label size="small">Delete</Label>}
                onClick={() => {
                  this.props.deleteFile(file_link, filePath);
                }}
              />
            ) : null}
          </Box>
        ) : null}
      </Box>
    ) : null;
  }
}

FileItem.propTypes = {
  file: PropTypes.object,
  action: PropTypes.func,
  deleteFile: PropTypes.func,
  bucket_id: PropTypes.string,
  filePreview: PropTypes.func,
  status: PropTypes.string
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFile: (file_uri, filepath) =>
      dispatch(deleteFileByUri(file_uri, filepath)),
    filePreview: file => dispatch(toggleFilePreviewEdit(file.data || file))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);
