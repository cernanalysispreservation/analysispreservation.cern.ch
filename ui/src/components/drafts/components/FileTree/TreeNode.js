import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FolderIcon from "grommet/components/icons/base/Folder";

import FileItem from "../FileItem";

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false };
  }

  onClick = () => {
    this.setState({ enabled: !this.state.enabled });
  };

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
              data.children.map((i, index) => {
                return <TreeNode key={index} data={i} />;
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
