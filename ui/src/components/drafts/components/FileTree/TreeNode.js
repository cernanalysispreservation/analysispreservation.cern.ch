import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

import AddIcon from "grommet/components/icons/base/Add";

import { Route } from "react-router-dom";

import { Treebeard, decorators } from "react-treebeard";
import Header from "./Header";
import Toggle from "./Toggle";

import _styles from "./styles";

import { arrangeIntoTree } from "./utils";

import DocumentTextIcon from "grommet/components/icons/base/DocumentText";
import FolderIcon from "grommet/components/icons/base/Folder";
import FolderOpenIcon from "grommet/components/icons/base/FolderOpen";
import MoreIcon from "grommet/components/icons/base/More";
import DocumentCsvIcon from "grommet/components/icons/base/DocumentCsv";
import DocumentImageIcon from "grommet/components/icons/base/DocumentImage";
import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
import Document from "grommet/components/icons/base/DocumentImage";
import ArchiveIcon from "grommet/components/icons/base/Archive";
import DocumentZip from "grommet/components/icons/base/DocumentZip";
import FileItem from "../FileItem";

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false };
  }

  onClick = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  _getIcon(type) {
    const catToIcon = {
      default: <Document type="status" size="small" />,
      archive: <ArchiveIcon type="status" size="small" />,
      configuration: <DocumentConfigIcon type="status" size="small" />,
      //   dataset: <PieChartIcon type="status" size="small" />,
      //   publication: <BookIcon type="status" size="small" />,
      //   plot: <PieChartIcon type="status" size="small" />,
      "image/png": <DocumentImageIcon type="status" size="small" />,
      "text/plain": <DocumentImageIcon type="status" size="small" />,
      "application/octet-stream": <DocumentZip type="status" size="small" />
    };

    return catToIcon[type] ? (
      catToIcon[type]
    ) : (
      <Document type="status" size="xsmall" />
    );
  }

  render() {
    let { data } = this.props;
    const isDirectory = data.children ? true : false;
    return (
      <Box>
        <Box flex="shrink" justify="between" direction="row" wrap={false}>
          {isDirectory ? (
            <Box
              direction="row"
              justify="center"
              align="center"
              style={{ marginBottom: "3px" }}
              onClick={this.onClick}
            >
              {this.state.enabled ? "-" : "+"}
              <Box justify="center" align="center" flex={false}>
                <FolderIcon size="xsmall" />
              </Box>
              <Box
                pad={{ horizontal: "small" }}
                direction="row"
                wrap={false}
                flex={true}
              >
                <Box flex={true} justify="between">
                  {truncateMiddleText(data.name)}
                </Box>
              </Box>
            </Box>
          ) : (
            <FileItem
              file={data.data ? data.data : data}
              filename={data.name}
              action={() => {}}
            />
          )}
        </Box>
        {this.state.enabled && (
          <Box margin={{ left: "small" }}>
            {data.children &&
              data.children.map(i => {
                return <TreeNode data={i} />;
              })}
          </Box>
        )}
      </Box>
    );
  }
}

let truncateMiddleText = (fullStr, strLen = 35, separator = "...") => {
  if (fullStr.length <= strLen) return fullStr;

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

TreeNode.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  id: PropTypes.string,
  match: PropTypes.object,
  files: PropTypes.object
};

export default TreeNode;
