import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";

import ListItem from "grommet/components/ListItem";
import Toast from "grommet/components/Toast";

import Status from "grommet/components/icons/Status";

import ArchiveIcon from "grommet/components/icons/base/Archive";
import BookIcon from "grommet/components/icons/base/Book";
import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
import PieChartIcon from "grommet/components/icons/base/PieChart";
import NoteIcon from "grommet/components/icons/base/Note";
import CloseIcon from "grommet/components/icons/base/Close";
import DownloadIcon from "grommet/components/icons/base/Download";
import MoreIcon from "grommet/components/icons/base/More";

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

  _getIcon(type) {
    const catToIcon = {
      default: <ArchiveIcon type="status" size="xsmall" />,
      archive: <ArchiveIcon type="status" size="xsmall" />,
      configuration: <DocumentConfigIcon type="status" size="xsmall" />,
      dataset: <PieChartIcon type="status" size="xsmall" />,
      publication: <BookIcon type="status" size="xsmall" />,
      plot: <PieChartIcon type="status" size="xsmall" />
    };

    return catToIcon[type] ? (
      catToIcon[type]
    ) : (
      <NoteIcon type="status" size="xsmall" />
    );
  }

  render() {
    let { file } = this.props;

    let { links: { self: file_link = null } = {}, key: filePath } = file;

    // TO_RMEOVE after fixings links from backend
    file_link = file_link ? file_link.replace("/files/", "/api/files/") : null;

    return file ? (
      <ListItem
        key={file.key}
        onClick={this.props.action ? this.props.action(file.key) : null}
        justify="between"
        pad="none"
        flex={true}
      >
        {file.status == "error" ? (
          <Toast status="critical">{file.error.message}</Toast>
        ) : null}
        <Box direction="row" flex={true} justify="between" wrap={false}>
          <Box direction="row" flex={true}>
            <Box justify="center" margin={{ horizontal: "small" }}>
              {this._getIcon(file.type)}
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
                {filePath}{" "}
                {file.size ? (
                  <strong>({prettyBytes(parseInt(file.size))})</strong>
                ) : null}
              </Label>
            </Box>
            {file.status ? (
              <Box justify="center" margin={{ right: "small" }}>
                <Status size="small" value={uploadStatusMap[file.status]} />
              </Box>
            ) : null}
            <Box direction="row" justify="center" align="center">
              <Menu
                responsive={true}
                size="small"
                inline={false}
                icon={<MoreIcon size="xsmall" />}
              >
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
              </Menu>
            </Box>
          </Box>
        </Box>
      </ListItem>
    ) : null;
  }
}

FileItem.propTypes = {
  file: PropTypes.object,
  action: PropTypes.func,
  deleteFile: PropTypes.func,
  bucket_id: PropTypes.string
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFile: (file_uri, filepath) =>
      dispatch(deleteFileByUri(file_uri, filepath))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);
