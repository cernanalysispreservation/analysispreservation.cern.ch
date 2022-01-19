import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { filter } from "lodash";

import { Divider, Empty, Space, Tree } from "antd";
import { constructTree } from "../utils/fileList";

const FileList = ({
  files,
  renderList = ["files", "repositories", "title"]
}) => {
  const [data, setData] = useState(constructTree(files));

  useEffect(
    () => {
      setData(constructTree(files));
    },
    [files]
  );

  const getContentFromProps = (value, displayTitle, repos, files) => {
    const choices = {
      repositories: (
        <React.Fragment>
          {displayTitle && <Divider style={{fontSize: "1em", margin: "0"}}>All Repositories</Divider> }
          {repos && repos.length > 0 ? (
            <Tree.DirectoryTree
              treeData={repos[0].children || []}
              selectable={false}
              showIcon={false}
            />
          ) : (
            <Empty description="No repos uploaded yet" />
          )}
        </React.Fragment>
      ),
      files: (
        <React.Fragment>
          <Space direction="vertical" style={{ width: "100%" }}>
            {displayTitle && <Divider style={{fontSize: "1em", margin: "0"}}>All Files</Divider>}
            {files.children && files.children.length > 0 ? (
              <Tree.DirectoryTree
                treeData={files.children}
                selectable={false}
                showIcon={false}
              />
            ) : (
              <Empty description="No files uploaded yet" />
            )}
          </Space>
        </React.Fragment>
      )
    };

    return choices[value];
  };

  let repos = filter(data.children, { name: "repositories" });
  let allFiles = {
    children: filter(data.children, item => item.name != "repositories")
  };
  let displayTitle = renderList.includes("title");

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {renderList.map(item =>
        getContentFromProps(item, displayTitle, repos, allFiles)
      )}
    </Space>
  );
};

FileList.propTypes = {
  renderList: PropTypes.array,
  files: PropTypes.array
};

export default FileList;
