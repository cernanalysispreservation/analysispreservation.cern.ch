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

const Container = ({ onSelect, style, customStyles, node }) => {
  const iconType = node.children ? "folder" : "file-text";

  return (
    <Box
      onClick={onSelect}
      flex={true}
      wrap={false}
      justify="between"
      direction="row"
      pad="xsmall"
    />
  );
};

export default Container;
