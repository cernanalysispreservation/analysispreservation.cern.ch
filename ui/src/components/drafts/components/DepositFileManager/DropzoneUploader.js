import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import FormUploadIcon from "grommet/components/icons/base/FormUpload";

import prettyBytes from "pretty-bytes";

import HorizontalWithText from "../../../partials/HorizontalWithText";
import { uploadFile } from "../../../../actions/files";

import CleanForm from "../../form/CleanForm";

import Dropzone from "react-dropzone";

import { Label } from "grommet";

const schema = {
  type: "object",
  properties: {
    directory: {
      title: "Upload Directory",
      type: "string"
    },
    filename: {
      title: "Filename",
      type: "string"
    },
    file_tags: {
      title: "File tags",
      description:
        "Tag additional information. Format `label=value` ( label: letters, digits, undescores). ex my_label=Proof that 1+1=11",
      type: "string"
    }
  }
};

const uiSchema = {
  file_tags: {
    "ui:widget": "tags",
    "ui:options": { pattern: "^\\w{1,255}=(.{1,100})$", delimiter: ";" }
  }
};

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      formData: {}
    };
  }

  _transformErrors(errors) {
    return errors.map(error => {
      if (error.name === "pattern") {
        error.message = "Add a valid filename";
      }
      return error;
    });
  }

  _onSave = data => {
    if (data.errors.length > 0) this.setState({ errors: data.formData });
    else {
      this.setState({ formData: data.formData });

      let filename = `${data.formData.directory || ""}${
        data.formData.filename
      }`;

      let bucket_url = this.props.links.bucket;
      bucket_url = bucket_url.replace(".cern.ch/", ".cern.ch/api/");
      this.props.uploadFile(
        bucket_url,
        this.state.acceptedFiles[0],
        filename,
        data.formData.file_tags
      );
    }
  };

  clearFormData = () => {
    this.setState({ formData: {} });
  };

  _renderUploadDetails() {
    let { name, size, type } = this.state.acceptedFiles[0];
    return (
      <Box
        pad="small"
        margin={{ top: "large", bottom: "small", horizontal: "medium" }}
        separator="all"
      >
        <Box
          direction="row"
          align="center"
          pad={{ between: "small" }}
          flex={true}
          justify="between"
        >
          <Label size="small">{name}</Label>
          {prettyBytes(size)}
        </Box>
        <CleanForm
          formRef={f => (this.formRef = f)}
          formData={{
            ...this.state.formData,
            filename: this.state.acceptedFiles[0].name
          }}
          schema={schema}
          uiSchema={uiSchema}
          transformErrors={this._transformErrors}
          onSubmit={this._onSave}
        >
          <Box
            direction="row"
            flex={true}
            pad={{ between: "small", vertical: "small" }}
            justify="end"
          >
            <Box
              pad="small"
              colorIndex="critical"
              onClick={() =>
                this.setState({ acceptedFiles: null, formData: {} })
              }
            >
              Cancel
            </Box>
            <Box
              pad="small"
              colorIndex="brand"
              type="submit"
              onClick={() => this.formRef.submit()}
            >
              Upload
            </Box>
          </Box>
        </CleanForm>
      </Box>
    );
  }

  _renderDropzone = () => (
    <Box
      pad={{ horizontal: "medium" }}
      margin={{ top: "large", bottom: "small" }}
    >
      <Box flex={true}>
        <Dropzone
          style={styles.dropzone}
          onDrop={acceptedFiles => {
            this.setState({
              acceptedFiles,
              formData: {
                ...this.state.formData,
                filename: acceptedFiles[0].name
              }
            });
          }}
        >
          <Heading tag="h3" justify="center" align="center">
            <Box direction="row" justify="center" align="center">
              <FormUploadIcon size="medium" />
            </Box>
          </Heading>
          <Box justify="center" align="center" pad={{ between: "small" }}>
            <Paragraph margin="none">
              <strong>Drag and Drop your files here</strong>
            </Paragraph>
            <HorizontalWithText text="OR" color="#666" />
            <Box margin={{ top: "medium" }}>
              <Box colorIndex="brand" pad="small" margin="none">
                Browse Files
              </Box>
            </Box>
          </Box>
        </Dropzone>
      </Box>
    </Box>
  );

  render() {
    if (this.state.acceptedFiles) return this._renderUploadDetails();
    else return this._renderDropzone();
  }
}

const styles = {
  dropzone: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100px",
    padding: "20px 0",
    backgroundColor: "#fff",
    borderRadius: "4px",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }
};

FileManager.propTypes = {
  links: PropTypes.object,
  uploadFile: PropTypes.func
};

function mapStateToProps(state) {
  return {
    links: state.draftItem.get("links")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadFile: (bucket_url, file, filename, tags) =>
      dispatch(uploadFile(bucket_url, file, filename, tags))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
