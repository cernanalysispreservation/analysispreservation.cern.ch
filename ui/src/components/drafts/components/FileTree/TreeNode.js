import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FileTreeHeader from "./FileTreeHeader";

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false };
  }

  _toggleCollapse = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  render() {
    let { data, root } = this.props;
    return (
      <Box>
        {!root ? (
          <FileTreeHeader
            data={data}
            enabled={this.state.enabled}
            toggleCollapse={this._toggleCollapse}
            onDirectoryClick={this.props.onDirectoryClick}
            onFileClick={this.props.onFileClick}
          />
        ) : null}
        {(this.state.enabled || root) && (
          <Box style={{ marginLeft: data.children && !root ? "16px" : "0" }}>
            {data.children &&
              data.children.map((i, index) => {
                return (
                  <TreeNode
                    key={index}
                    data={i}
                    onDirectoryClick={this.props.onDirectoryClick}
                    onFileClick={this.props.onFileClick}
                  />
                );
              })}
          </Box>
        )}
      </Box>
    );
  }
}

TreeNode.propTypes = {
  root: PropTypes.bool,
  selected: PropTypes.object,
  data: PropTypes.object,
  onDirectoryClick: PropTypes.func,
  onFileClick: PropTypes.func
};

export default TreeNode;
