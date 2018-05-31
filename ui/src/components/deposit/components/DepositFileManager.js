import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
  Anchor,
  Box,
  Button,
  Paragraph,
  Tabs,
  Title,
  Tab,
  Header,
  Layer,
  Sidebar,
  Form,
  FormField,
  TextInput,
  Article,
  Heading,
  Select,
  Toast
} from 'grommet';

import { toggleFilemanagerLayer, initDraft, uploadFile, uploadViaUrl } from '../../../actions/drafts';
import LinkIcon from 'grommet/components/icons/base/Link';

import FileList from './FileList';

import CleanForm from '../form/CleanForm';

import Dropzone from 'react-dropzone';

const schema = {
  type: "string"
};

const uiSchema = {
  "ui:placeholder": "Please provide a valid file url"
};

const uiSchemaRepoUpload = {
  "ui:placeholder": "Please provide a valid repository url"
};

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  actionWithFile = (key) => {
    this.props.selectableActionLayer(key);
    this.props.toggleFilemanagerLayer();
  }

  setSelected = (key) => this.setState({selected: key})

  render() {
    return (
      this.props.activeLayer && this.props.links ?
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleFilemanagerLayer}>
        <Box size={{height: "large" , width: "xxlarge"}}>
          <Box flex={true}>
            <Box flex={false}  pad="small" colorIndex="light-2">
              <Title>File Manager (<Anchor label="bucket" icon={<LinkIcon size="xsmall"/>} href={this.props.links.get('bucket')} size="small"/>)</Title>
            </Box>
            <Box flex={false} justify="center" pad="small" pp={{horizontal:"small"}} colorIndex="grey-2">
              {
                this.props.selectableActionLayer ?
                "Select or upload a file to be added to the project" :
                "Upload and manage project files"
              }
            </Box>
            <Box flex={true} direction="row">
              <Box flex={true}>
                <FileList action={this.setSelected.bind(this)} files={this.props.files}/>
              </Box>
              <Box flex={true} pad="small" colorIndex="grey-4-a">
                <Tabs justify="start">
                  <Tab title="Upload File">
                    <Box >
                      <Heading tag="h5" strong={true}>Upload from Local</Heading>
                      <Box margin={{bottom: "small"}}>
                        <Box flex={true} >
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
                            onDrop={(acceptedFiles, rejectedFiles) => {
                              let bucket_url = this.props.links.get('bucket');
                              bucket_url = bucket_url.replace('.cern.ch/', '.cern.ch/api/')
                              // console.log("acceptedFiles", acceptedFiles);
                              // console.log(rejectedFiles);

                              if (acceptedFiles.length > 0) this.props.uploadFile(bucket_url, acceptedFiles[0]);
                            }}>
                            Try dropping some files here, or click to select files to upload.
                          </Dropzone>
                        </Box>
                      </Box>
                      <Heading tag="h5" strong={true}>Upload from URL</Heading>
                      <Box>
                        <CleanForm
                          schema={schema}
                          uiSchema={uiSchema}
                          onSubmit={(data) => {
                            this.props.uploadViaUrl(this.props.draft_id, data.formData)
                          }}
                        >
                          <Box margin={{top:'small'}}>
                            <Button label='Upload'
                              type='submit'
                              primary={true}
                            />
                          </Box>
                        </CleanForm>
                      </Box>
                    </Box>
                  </Tab>
                  <Tab title="Repo Upload">
                    <Box pad="medium">
                      <Heading tag="h5" strong={true}>Upload from Gitlab CERN/Github</Heading>
                      <Box direction="row">
                          <CleanForm
                            schema={schema}
                            uiSchema={uiSchemaRepoUpload}
                            onSubmit={(data) => {
                              this.props.uploadViaUrl(this.props.draft_id, data.formData)
                            }}
                          >
                          <Box margin={{top:'small'}}>
                            <Button label='Upload'
                              type='submit'
                              primary={true}
                            />
                          </Box>
                        </CleanForm>
                      </Box>
                    </Box>
                  </Tab>
                </Tabs>
              </Box>
            </Box>
            {
              this.props.selectableActionLayer ?
              <Box colorIndex="light-2" direction="row" flex={false}>
                <Box colorIndex="light-2" pad="small" direction="row" flex={false}>
                  <Button primary={true} label="Select File" onClick={this.state.selected ? () => this.actionWithFile(this.state.selected ) : null} />
                </Box>
                <Box colorIndex="light-2" pad="small" direction="row" flex={false}>
                  <Button label="Cancel" onClick={this.props.toggleFilemanagerLayer} />
                </Box>
              </Box> : null
            }
          </Box>
        </Box>
      </Layer> : null
    );
  }
}

FileManager.propTypes = {
  activeLayer: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    activeLayer: state.drafts.get("fileManagerActiveLayer"),
    selectableLayer: state.drafts.get("fileManagerLayerSelectable"),
    selectableActionLayer: state.drafts.get("fileManagerLayerSelectableAction"),
    links: state.drafts.getIn(['current_item','links']),
    draft_id: state.drafts.getIn(['current_item', 'id'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    initDraft: (schema, title) => dispatch(initDraft(schema, title)),
    uploadFile: (bucket_url, file) => dispatch(uploadFile(bucket_url, file)),
    uploadViaUrl: (draft_id, url) => dispatch(uploadViaUrl(draft_id, url))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
