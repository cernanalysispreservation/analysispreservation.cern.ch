import React from "react";
import PropTypes from "prop-types";

import { Box, Label, Anchor, ListItem, Toast } from "grommet";

import Status from "grommet/components/icons/Status";
import {
  ArchiveIcon,
  DocumentConfigIcon,
  PieChartIcon,
  BookIcon,
  NoteIcon,
  DownloadIcon
} from "grommet/components/icons/base";

import prettyBytes from "pretty-bytes";

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
    let filename = file.key.split("/").pop();
    return (
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
                {filename}{" "}
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
            <Anchor href="#" icon={<DownloadIcon />} />
          </Box>
        </Box>
      </ListItem>
    );
  }
}

FileItem.propTypes = {
  file: PropTypes.object,
  action: PropTypes.func
};

export default FileItem;
