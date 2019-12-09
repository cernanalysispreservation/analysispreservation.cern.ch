import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";

import AddIcon from "grommet/components/icons/base/Add";

import { Route } from "react-router-dom";

import TreeNode from "./TreeNode";

import { arrangeIntoTree } from "./utils";

class FileTree extends React.Component {
  constructor(props) {
    super(props);
    let data = this.constructTree(props.files);
    this.state = { data };
  }

  componentWillReceiveProps(nextProps) {
    let data = this.constructTree(nextProps.files);
    this.setState({ data });
  }

  _renderAddFileIcon() {
    return (
      <Route
        path="/drafts/:draft_id/edit"
        render={() => (
          <Anchor
            onClick={this.props.toggleFilemanagerLayer}
            size="xsmall"
            icon={<AddIcon />}
          />
        )}
      />
    );
  }

  onToggle = (node, toggled) => {
    const { cursor, data } = this.state;
    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState(() => ({ cursor: node, data: Object.assign({}, data) }));
  };

  constructTree = data => {
    let tree = { name: "All Files", id: 1, toggled: true };
    let paths = [];

    Object.keys(data).map(k => {
      paths.push([k.split("/"), data[k]]);
    });

    let children = arrangeIntoTree(paths);
    return { ...tree, children };
  };

  render() {
    return <TreeNode data={this.state.data} />;
  }
}

FileTree.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  id: PropTypes.string,
  match: PropTypes.object,
  files: PropTypes.object
};

export default FileTree;
