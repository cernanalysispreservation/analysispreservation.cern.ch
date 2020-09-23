import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import TreeNode from "./TreeNode";

import { FaGithub, FaGitlab } from "react-icons/fa";
import { BsCodeSlash } from "react-icons/bs";

class RepoTree extends React.Component {
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

  render() {
    let repos = this.props.repos;

    return repos && repos.length > 0 ? (
      repos[0].children.map(resource => (
        <Box key={resource}>
          {resource.children.map(owner => (
            <Box key={owner}>
              {owner.children.map(repo => (
                <Box key={`${owner.name}/${repo.name}`}>
                  <Box
                    style={{ padding: "3px 1px" }}
                    flex={true}
                    direction="row"
                    wrap="false"
                    align="center"
                  >
                    <Box style={{ marginRight: "4px" }}>
                      {resource.name == "github.com" ? (
                        <FaGithub size="12" />
                      ) : (
                        <FaGitlab size="12" />
                      )}
                    </Box>
                    <Box>{`${owner.name}/${repo.name}`}</Box>
                  </Box>
                  <TreeNode
                    data={{ children: repo.children }}
                    onDirectoryClick={this.props.onDirectoryClick}
                    onFileClick={this.props.onFileClick}
                    root
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))
    ) : (
      <Box flex={true} pad="small" justify="center" align="center">
        <Box
          colorIndex="light-2"
          style={{ borderRadius: "50%", padding: "5px" }}
        >
          <BsCodeSlash size={18} />
        </Box>
        No uploaded repositories yet
      </Box>
    );
  }
}

RepoTree.propTypes = {
  repos: PropTypes.array,
  onFileClick: PropTypes.func,
  onDirectoryClick: PropTypes.func
};

export default RepoTree;
