import React from "react";
import PropTypes from "prop-types";
import { Divider, Empty, Space, Tree } from "antd";
import { filter } from "lodash";
import { constructTree } from "../utils/fileList";

const Files = ({
  renderList = ["files", "repositories", "title"],
  moodaUpate,
  memoFiles = Map({}),
  onFileClick = null,
}) => {
  let data = constructTree(
    memoFiles,
    file => moodaUpate(file),
    file => onFileClick(file.data.key)
  );
  let repos = filter(data.children, { name: "repositories" });
  let files = {
    children: filter(data.children, item => item.name != "repositories"),
  };
  let displayTitle = renderList.includes("title");

  const getContentFromProps = value => {
    const choices = {
      repositories: (
        <React.Fragment>
          <Space direction="vertical" style={{ width: "100%" }}>
            {displayTitle && (
              <Divider style={{ fontSize: "1em", margin: "0" }}>
                All Repositories
              </Divider>
            )}
            {repos && repos.length > 0 ? (
              <Tree.DirectoryTree
                treeData={repos[0].children || []}
                selectable={false}
                showIcon={false}
                style={{ overflowY: "auto" }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No repos uploaded yet"
              />
            )}
          </Space>
        </React.Fragment>
      ),
      files: (
        <React.Fragment>
          <Space direction="vertical" style={{ width: "100%" }}>
            {displayTitle && (
              <Divider style={{ fontSize: "1em", margin: "0" }}>
                All Files
              </Divider>
            )}
            {files.children && files.children.length > 0 ? (
              <Tree.DirectoryTree
                treeData={files.children}
                selectable={false}
                showIcon={false}
                style={{ overflowY: "auto" }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No files uploaded yet"
              />
            )}
          </Space>
        </React.Fragment>
      ),
    };

    return choices[value];
  };

  return renderList.map(item => getContentFromProps(item));
};

Files.propTypes = {
  renderList: PropTypes.array,
  modalUpdate: PropTypes.func,
  memoFiles: PropTypes.object,
};

export default React.memo(Files);
