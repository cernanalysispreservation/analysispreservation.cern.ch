import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

import AddIcon from "grommet/components/icons/base/Add";

import { Route } from "react-router-dom";
import { Treebeard, decorators } from "react-treebeard";

import DocumentTextIcon from "grommet/components/icons/base/DocumentText";
import FolderIcon from "grommet/components/icons/base/Folder";
import FolderOpenIcon from "grommet/components/icons/base/FolderOpen";
// import MiddleTruncate from 'react-middle-truncate';

const Header = ({ onSelect, style, customStyles, node }) => {
  const iconType = node.children ? "folder" : "file-text";

  return (
    <Box
      onClick={onSelect}
      flex={true}
      wrap={false}
      justify="between"
      direction="row"
      pad="xsmall"
    >
      <Box flex={false} style={{ padding: "0 10px" }}>
        {iconType != "folder" ? (
          <DocumentTextIcon size="small" />
        ) : (
          <FolderIcon size="small" />
        )}
      </Box>
      <Box flex={true} pad="small" colorIndex="brand">
        <div style={{ flexShrink: 1, textOverflow: "truncate" }}>
          {node.name + node.name}
        </div>
      </Box>
    </Box>
  );
};

export default Header;
