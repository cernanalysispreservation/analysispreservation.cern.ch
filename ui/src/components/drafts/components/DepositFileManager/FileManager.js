import React from "react";
import PropTypes from "prop-types";

import { Provider } from "react-redux";
import store from "../../../../store/configureStore";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";

import FileTree from "../FileTree";

import { Label, Paragraph } from "grommet";
import DropzoneUploader from "./DropzoneUploader";

class FileManager extends React.Component {
  _renderSidebar = () => {
    return (
      <Box flex={false} size={{ width: "large" }}>
        <Box flex={false} pad="small" colorIndex="light-1" separator="bottom">
          <Label size="medium" margin="none">
            File Manager
          </Label>
          <Paragraph margin="none">
            Click on a file from the list to select it
          </Paragraph>
        </Box>
        <Box flex={true} margin={{ top: "small", right: "small" }}>
          <FileTree
            files={this.props.files}
            onDirectoryClick={this.props.onDirectoryClick}
            onFileClick={this.props.onFileClick}
          />
        </Box>
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
          <Box size={{ height: "xlarge", width: { min: "large" } }}>
            <Box flex={true}>
              <Box flex={true} direction="row">
                {this.props.onSelect ? (
                  this._renderSidebar()
                ) : (
                  <Box flex={true}>
                    <DropzoneUploader />
                  </Box>
                )}
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
  message: PropTypes.string,
  onDirectoryClick: PropTypes.func,
  onFileClick: PropTypes.func,
  onSelect: PropTypes.func
};

export default FileManager;
