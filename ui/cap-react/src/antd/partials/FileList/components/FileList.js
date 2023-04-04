import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import { Space } from "antd";
import FileModal from "../containers/FileModal";
import Files from "./Files";

const FileList = ({
  files,
  renderList = ["files", "repositories", "title"],
}) => {
  const [fileToDisplay, setFileToDisplay] = useState(null);

  const memoFiles = useMemo(
    () => {
      return files;
    },
    [files]
  );
  const myRenderList = useMemo(() => renderList, []);
  const onClickModal = useCallback(
    file => {
      setFileToDisplay(file);
    },
    [setFileToDisplay]
  );

  return (
    <React.Fragment>
      <FileModal
        open={fileToDisplay}
        onCancel={() => setFileToDisplay(false)}
        file={fileToDisplay}
      />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Files
          renderList={myRenderList}
          memoFiles={memoFiles}
          moodaUpate={onClickModal}
        />
      </Space>
    </React.Fragment>
  );
};

FileList.propTypes = {
  renderList: PropTypes.array,
  files: PropTypes.array,
};

export default FileList;
