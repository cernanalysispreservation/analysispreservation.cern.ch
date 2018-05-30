import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
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

import { toggleFilemanagerLayer, initDraft, uploadFile } from '../../../actions/drafts';

import FileList from './FileList';

import Dropzone from 'react-dropzone';

class FileManager extends React.Component {
  constructor(props) {
    super(props);
  }

  _onSubmit(schema, data) {
    event.preventDefault();

    this.props.initDraft(schema, data.formData )
  }

  render() {
    return (
      this.props.activeLayer && this.props.links ?
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleFilemanagerLayer}
        >
        <Box size={{height: {min: "xxlarge"} , width: "xxlarge"}}>
          <Box direction="row" size="xlarge" flex={true} wrap={false}>
            <Sidebar size="small" full={false} colorIndex="light-2">
              <Header>
                <Box pad={{horizontal: "small"}}>
                  <Title>File Manager</Title>
                  {this.props.links.get('bucket')}
                </Box>
              </Header>
              <Box pad="small" colorIndex="light-2">
                <FileList files={this.props.files}/>
              </Box>
            </Sidebar>

            <Box size="large" flex={true}>
              <Tabs>
                <Tab title="Upload File">
                  <Box pad="medium">
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
                      <FormField
                        label="URL to upload">
                        <TextInput />
                      </FormField>
                    </Box>
                  </Box>
                </Tab>
                <Tab title="Repo Upload">
                  <Box pad="medium">
                    <Heading tag="h5" strong={true}>Upload from Gitlab CERN/Github</Heading>
                    <Box direction="row">
                      <Form>
                      <FormField
                        label="Location">
                        <Select
                          placeHolder="None"
                          options={["CERN Gitlab", "Github"]}
                          value={undefined}
                        />
                      </FormField>
                      <Box direction="row">
                        <FormField
                          label="User/Organisation"
                          >
                          <TextInput placeHolder="johndoe"/>
                        </FormField>
                        <FormField
                          label="Repo">
                          <TextInput placeHolder="myanalysis"/>
                        </FormField>
                      </Box>
                      </Form>

                    </Box>
                  </Box>
                </Tab>
                <Tab title="Image Upload">
                  <Box pad="medium">
                    <Heading tag="h5" strong={true}>Upload your image container from CERN Gitlab</Heading>
                    <Box direction="row">
                      <Form>
                      <FormField
                        label="Location">
                        <Select
                          placeHolder="None"
                          options={["CERN Gitlab", "Github"]}
                          value={undefined}
                        />
                      </FormField>
                      <Box direction="row">
                        <FormField
                          label="User/Organisation"
                          >
                          <TextInput placeHolder="johndoe"/>
                        </FormField>
                        <FormField
                          label="Repo">
                          <TextInput placeHolder="myanalysis"/>
                        </FormField>
                      </Box>
                      </Form>
                    </Box>
                  </Box>
                </Tab>
              </Tabs>
            </Box>
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
    links: state.drafts.getIn(['current_item','links'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    initDraft: (schema, title) => dispatch(initDraft(schema, title)),
    uploadFile: (bucket_url, file) => dispatch(uploadFile(bucket_url, file))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);