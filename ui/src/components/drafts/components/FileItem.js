import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";

import ListItem from "grommet/components/ListItem";

import cogoToast from "cogo-toast";

import Status from "grommet/components/icons/Status";
import NoteIcon from "grommet/components/icons/base/Note";
import CloseIcon from "grommet/components/icons/base/Close";
import DownloadIcon from "grommet/components/icons/base/Download";
import MoreIcon from "grommet/components/icons/base/More";
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

  render() {
    let { file } = this.props;

    let { links: { self: file_link = null } = {}, key: filePath } =
      file.data || file;

    // TO_RMEOVE after fixings links from backend
    file_link = file_link ? file_link.replace("/files/", "/api/files/") : null;

    return file ? (
      <Box
        key={file.key}
        onClick={
          this.props.action
            ? this.props.action(file.key)
            : this.props.filePreview(file)
        }
        justify="between"
        pad="none"
        flex={true}
      >
        {file.status == "error" ? this.showToaster(file.error.message) : null}
        <Box direction="row" flex={true} justify="between" wrap={false}>
          <Box direction="row" flex={true} justify="between" wrap={false}>
            <Box direction="row" flex={true}>
              <Box justify="center" margin={{ horizontal: "small" }}>
                {this._getIcon(file.mimetype)}
              </Box>
              <Box
                justify="center"
                flex={true}
                width="100"
                size="small"
                margin={{ right: "small" }}
              >
                <Label
                  justify="center"
                  margin="none"
                  size="small"
                  truncate={true}
                >
                  {this.props.filename ? this.props.filename : filePath}{" "}
                  {file.size ? (
                    <strong>({prettyBytes(parseInt(file.size))})</strong>
                  ) : null}
                </Label>
              </Box>
            </Box>
            {file.status ? (
              <Box justify="center" margin={{ right: "small" }}>
                <Status size="small" value={uploadStatusMap[file.status]} />
              </Box>
            ) : null}
            <Box direction="row" justify="center" align="center">
              <Anchor
                size="small"
                icon={<DownloadIcon size="xsmall" />}
                label={<Label size="small" />}
                href={file_link}
                download
              />
              {this.props.status !== "published" ? (
                <Anchor
                  size="small"
                  icon={<CloseIcon size="xsmall" />}
                  label={<Label size="small" />}
                  onClick={() => {
                    this.props.deleteFile(file_link, filePath);
                  }}
                />
              ) : null}
            </Box>
          </Box>
        </Box>
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
