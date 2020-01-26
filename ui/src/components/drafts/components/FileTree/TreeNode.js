import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FolderIcon from "grommet/components/icons/base/Folder";
import CaretNextIcon from "grommet/components/icons/base/CaretNext";
import CaretDownIcon from "grommet/components/icons/base/CaretDown";

import { FaCaretRight, FaCaretDown } from "react-icons/fa";

import FileItem from "../FileItem";

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false };
  }

  onClick = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  _renderHeader = () => {
    let { data, root } = this.props;
    const isDirectory = data.children ? true : false;

    return (
      <Box flex={true} justify="between" direction="row" wrap={false}>
        <Box flex={true} direction="row" wrap={false}>
          <Box style={{ marginRight: "5px", width: "15px" }}>
            {isDirectory ? (
              <Box onClick={this.onClick}>
                {this.state.enabled ? (
                  <FaCaretDown width="4" />
                ) : (
                  <FaCaretRight width="4" />
                )}
              </Box>
            ) : null}
          </Box>
          {isDirectory ? (
            <Box
              direction="row"
              justify="center"
              align="center"
              style={{
                marginBottom: "3px",
                fontWeight: "900"
              }}
              onClick={this.onClick}
            >
              <Box justify="center" align="center" flex={false}>
                <FolderIcon size="xsmall" />
              </Box>
              <Box
                style={{ paddingLeft: "5px" }}
                direction="row"
                wrap={false}
                flex={true}
              >
                <Box flex={true} justify="between">
                  {data.name && truncateMiddleText(data.name)}
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
      </Box>
    );
  };

  render() {
    let { data, root } = this.props;
    return (
      <Box>
        {!root ? this._renderHeader() : null}

        {(this.state.enabled || root) && (
          <Box style={{ marginLeft: data.children && !root ? "16px" : "0" }}>
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
