import React from "react";
import PropTypes from "prop-types";

import { connect, Provider } from "react-redux";
import store from "../../../../store/configureStore";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";

import { toggleFilemanagerLayer, uploadFile } from "../../../../actions/files";

import FileTree from "../FileTree";

import { Label } from "grommet";
import DropzoneUploader from "./DropzoneUploader";
import RepoUploader from "./RepoUploader";

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      formData: []
    };
  }

  setSelected = key => this.setState({ selected: key });

  actionWithFile = key => {
    this.props.selectableActionLayer(key);
    this.props.toggleFilemanagerLayer();
  };

  _renderSidebar = () => (
    <Box flex={false} size={{ width: "medium" }}>
      <Box flex={false} pad="small" colorIndex="light-1" separator="bottom">
        <Label size="medium" margin="none">
          File Manager
        </Label>
        {this.props.message
          ? this.props.message
          : this.props.selectableActionLayer
            ? "Select or upload a file to be added to the project"
            : "Upload and manage workspace files"}
      </Box>

      <Box flex={true} margin={{ top: "small", right: "small" }}>
        <FileTree
          action={this.setSelected.bind(this)}
          files={this.props.files.toJS()}
        />
      </Box>

      {this.props.selectableActionLayer ? (
        <Box colorIndex="light-2" direction="row" flex={false}>
          <Box colorIndex="light-2" pad="small" direction="row" flex={false}>
            <Button
              primary={true}
              label="Select File"
              onClick={
                this.state.selected
                  ? () => this.actionWithFile(this.state.selected)
                  : null
              }
            />
          </Box>
          <Box colorIndex="light-2" pad="small" direction="row" flex={false}>
            <Button
              label="Cancel"
              onClick={this.props.toggleFilemanagerLayer}
            />
          </Box>
        </Box>
      ) : null}
    </Box>
  );

  render() {
    return this.props.activeLayer && this.props.links ? (
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleFilemanagerLayer}
      >
        <Provider store={store}>
          <Box size={{ height: "large", width: { min: "xxlarge" } }}>
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

// this.props.uploadViaUrl(
//   this.props.id,
//   this.state.formData,
//   "file",
//   true,
//   false // default for file
// );

// this.props.uploadViaUrl(
//   this.props.id,
//   this.state.formData,
//   "repo",
//   this.state.download,
//   this.state.webhook
// );

FileManager.propTypes = {
  activeLayer: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  selectableActionLayer: PropTypes.func,
  links: PropTypes.object,
  files: PropTypes.object,
  uploadFile: PropTypes.func,
  uploadViaUrl: PropTypes.func,
  id: PropTypes.string,
  active: PropTypes.number,
  message: PropTypes.string
};

function mapStateToProps(state) {
  return {
    activeLayer: state.draftItem.get("fileManagerActiveLayer"),
    active: state.draftItem.get("fileManagerLayerActiveIndex"),
    selectableLayer: state.draftItem.get("fileManagerLayerSelectable"),
    selectableActionLayer: state.draftItem.get(
      "fileManagerLayerSelectableAction"
    ),
    links: state.draftItem.get("links"),
    id: state.draftItem.get("id")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    uploadFile: (bucket_url, file) => dispatch(uploadFile(bucket_url, file)),
    uploadViaUrl: (id, url, type, download, webhook) =>
      dispatch(uploadViaUrl(id, url, type, download, webhook))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
