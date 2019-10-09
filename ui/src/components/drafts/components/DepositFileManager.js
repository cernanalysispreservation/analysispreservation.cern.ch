import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Button from "grommet/components/Button";
import Tabs from "grommet/components/Tabs";
import Title from "grommet/components/Title";
import Tab from "grommet/components/Tab";
import Layer from "grommet/components/Layer";

import {
  toggleFilemanagerLayer,
  uploadFile,
  uploadViaUrl
} from "../../../actions/files";

import LinkIcon from "grommet/components/icons/base/Link";

import FileList from "./FileList";

import CleanForm from "../form/CleanForm";

import Dropzone from "react-dropzone";

const schema = {
  type: "string"
};

const uiSchema = {
  "ui:placeholder": "Please provide a Github or Gitlab CERN file url",
  "ui:widget": "tags",
  "ui:options": {
    pattern: /(http:\/\/|https:\/\/|root:\/\/)(github\.com|gitlab\.cern\.ch)?(\/.*)?$/
  }
};

const uiSchemaRepoUpload = {
  "ui:placeholder":
    "Please provide a valid Github or Gitlab CERN repository url",
  "ui:widget": "tags",
  "ui:options": {
    pattern: /(http:\/\/|https:\/\/)(github\.com|gitlab\.cern\.ch)?(\/.*)?$/
  }
};

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      formData: []
    };
  }

  actionWithFile = key => {
    this.props.selectableActionLayer(key);
    this.props.toggleFilemanagerLayer();
  };

  setSelected = key => this.setState({ selected: key });

  formDataChange = data => {
    this.setState({ formData: data });
  };

  clearFormData = () => {
    this.setState({ formData: [] });
  };

  render() {
    return this.props.activeLayer && this.props.links ? (
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleFilemanagerLayer}
      >
        <Box size={{ height: "large", width: "xxlarge" }}>
          <Box flex={true}>
            <Box flex={false} pad="small" colorIndex="light-2">
              <Title>
                File Manager (<Anchor
                  label="bucket"
                  icon={<LinkIcon size="xsmall" />}
                  href={this.props.links.bucket}
                  size="small"
                />)
              </Title>
            </Box>
            <Box
              flex={false}
              justify="center"
              pad="small"
              pp={{ horizontal: "small" }}
              colorIndex="grey-2"
            >
              {this.props.selectableActionLayer
                ? "Select or upload a file to be added to the project"
                : "Upload and manage project files"}
            </Box>
            <Box flex={true} direction="row">
              <Box flex={true}>
                <FileList
                  action={this.setSelected.bind(this)}
                  files={this.props.files}
                />
              </Box>
              <Box flex={true} pad="small" colorIndex="grey-4-a">
                <Tabs justify="start" onActive={this.clearFormData}>
                  <Tab title="Upload File">
                    <Box>
                      <Heading tag="h5" strong={true}>
                        Upload from Local
                      </Heading>
                      <Box margin={{ bottom: "small" }}>
                        <Box flex={true}>
                          <Dropzone
                            style={{
                              display: "flex",
                              flex: 1,
                              height: "100px",
                              border: "2px dashed rgba(0, 0, 0, 0.25)",
                              borderRadius: "4px",
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center"
                            }}
                            onDrop={acceptedFiles => {
                              let bucket_url = this.props.links.bucket;
                              bucket_url = bucket_url.replace(
                                ".cern.ch/",
                                ".cern.ch/api/"
                              );

                              if (acceptedFiles.length > 0)
                                this.props.uploadFile(
                                  bucket_url,
                                  acceptedFiles[0]
                                );
                            }}
                          >
                            Drop your files here, or click to select files to
                            upload.
                          </Dropzone>
                        </Box>
                      </Box>
                      <Heading tag="h5" strong={true}>
                        Upload from CERN Gitlab/Github file URL
                      </Heading>
                      <Box>
                        <Box flex={true}>
                          <CleanForm
                            formData={this.state.formData}
                            schema={schema}
                            uiSchema={uiSchema}
                            onChange={change => {
                              this.formDataChange(change.formData);
                            }}
                          >
                            <Box margin={{ top: "small" }}>
                              {this.state.formData.length > 0 ? (
                                <Button
                                  label="Upload"
                                  primary={true}
                                  fill={true}
                                  onClick={() => {
                                    this.props.uploadViaUrl(
                                      this.props.id,
                                      this.state.formData,
                                      "url"
                                    );
                                  }}
                                />
                              ) : (
                                <Button
                                  label="Upload"
                                  primary={true}
                                  fill={true}
                                />
                              )}
                            </Box>
                          </CleanForm>
                        </Box>
                      </Box>
                    </Box>
                  </Tab>
                  <Tab title="Repo Upload">
                    <Box pad="medium">
                      <Heading tag="h5" strong={true}>
                        Upload from Gitlab CERN/Github repository url
                      </Heading>
                      <Box direction="row">
                        <CleanForm
                          formData={this.state.formData}
                          schema={schema}
                          uiSchema={uiSchemaRepoUpload}
                          onChange={change => {
                            this.formDataChange(change.formData);
                          }}
                        >
                          <Box margin={{ top: "small" }}>
                            {this.state.formData.length > 0 ? (
                              <Button
                                label="Upload"
                                primary={true}
                                fill={true}
                                onClick={() => {
                                  this.props.uploadViaUrl(
                                    this.props.id,
                                    this.state.formData,
                                    "repo"
                                  );
                                }}
                              />
                            ) : (
                              <Button
                                label="Upload"
                                primary={true}
                                fill={true}
                              />
                            )}
                          </Box>
                        </CleanForm>
                      </Box>
                    </Box>
                  </Tab>
                </Tabs>
              </Box>
            </Box>
            {this.props.selectableActionLayer ? (
              <Box colorIndex="light-2" direction="row" flex={false}>
                <Box
                  colorIndex="light-2"
                  pad="small"
                  direction="row"
                  flex={false}
                >
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
                <Box
                  colorIndex="light-2"
                  pad="small"
                  direction="row"
                  flex={false}
                >
                  <Button
                    label="Cancel"
                    onClick={this.props.toggleFilemanagerLayer}
                  />
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Layer>
    ) : null;
  }
}

FileManager.propTypes = {
  activeLayer: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  selectableActionLayer: PropTypes.func,
  links: PropTypes.object,
  files: PropTypes.object,
  uploadFile: PropTypes.func,
  uploadViaUrl: PropTypes.func,
  id: PropTypes.string
};

function mapStateToProps(state) {
  return {
    activeLayer: state.draftItem.get("fileManagerActiveLayer"),
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
    uploadViaUrl: (id, url, type) => dispatch(uploadViaUrl(id, url, type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
