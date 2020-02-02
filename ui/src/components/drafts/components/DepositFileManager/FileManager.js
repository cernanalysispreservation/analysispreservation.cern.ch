import React from "react";
import PropTypes from "prop-types";

import { connect, Provider } from "react-redux";
import store from "../../../../store/configureStore";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";

import { selectPath } from "../../../../actions/files";

import FileTree from "../FileTree";

import { Label } from "grommet";
import DropzoneUploader from "./DropzoneUploader";
import RepoUploader from "./RepoUploader";

class FileManager extends React.Component {
  _renderSidebar = () => {
    return (
      <Box flex={false} size={{ width: "medium" }}>
        <Box flex={false} pad="small" colorIndex="light-1" separator="bottom">
          <Label size="medium" margin="none">
            File Manager
          </Label>
        </Box>
        <Box flex={true} margin={{ top: "small", right: "small" }}>
          <FileTree
            files={this.props.files}
            onDirectoryClick={this.props.onDirectoryClick}
            onFileClick={this.props.onFileClick}
          />
        </Box>

        {this.props.onSelect ? (
          <Box
            colorIndex="light-2"
            direction="row"
            flex={false}
            pad="small"
            separator="top"
          >
            <Box>
              <Label size="small">
                <strong>
                  {this.props.message
                    ? this.props.message
                    : "Please select a file from the list, to add it to the field"}
                </strong>
              </Label>
              {this.props.pathSelected &&
                this.props.pathSelected.type == "file" && (
                  <Box>
                    <Label size="small">
                      <strong>Selected file:</strong>{" "}
                      {this.props.pathSelected && this.props.pathSelected.path}
                    </Label>
                  </Box>
                )}
              <Box
                colorIndex="light-2"
                margin={{ top: "small" }}
                pad={{ between: "small" }}
                direction="row"
                flex={false}
              >
                <Button
                  primary={true}
                  label="Add to field"
                  onClick={
                    this.props.pathSelected
                      ? () => this.props.onSelect(this.props.pathSelected)
                      : null
                  }
                />
                <Button
                  label="Cancel"
                  critical={true}
                  onClick={this.props.toggleLayer}
                />
              </Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    );
  };

  render() {
    return this.props.activeLayer ? (
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleLayer}
      >
        <Provider store={store}>
          <Box size={{ height: "xlarge", width: { min: "xxlarge" } }}>
            <Box flex={true}>
              <Box flex={true} direction="row">
                {this._renderSidebar()}
                <Box flex={true} colorIndex="grey-4">
                  <DropzoneUploader />
                  <RepoUploader />
                </Box>
              </Box>
            </Box>
          </Box>
        </Provider>
      </Layer>
    ) : null;
  }
}

FileManager.propTypes = {
  activeLayer: PropTypes.bool,
  toggleLayer: PropTypes.func,
  selectableActionLayer: PropTypes.func,
  files: PropTypes.object,
  active: PropTypes.number,
  message: PropTypes.string
};

export default FileManager;
