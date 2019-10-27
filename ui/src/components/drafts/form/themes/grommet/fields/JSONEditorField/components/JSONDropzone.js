import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Dropzone from "react-dropzone";
import yaml from "js-yaml";
import FormUploadIcon from "grommet/components/icons/base/FormUpload";
import { Paragraph } from "grommet";

class JSONDropzone extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  setJSON = data => {
    // console.log("sertJSON::", data);
    this.props.onChange(data);
  };

  toggleLayer = () => {
    this.setState({ editorOpen: !this.state.editorOpen });
  };

  onJSONReaderLoad = event => {
    try {
      let obj = JSON.parse(event.target.result);
      this.props.setJSON(obj);
    } catch (e) {
      this.setState({
        error: "There was an issue with the JSON file you uploaded"
      });
    }
  };

  onYAMLReaderLoad = event => {
    try {
      let obj = yaml.safeLoad(event.target.result);
      this.props.setJSON(obj);
    } catch (e) {
      this.setState({
        error: "There was an issue with the YAML file you uploaded"
      });
    }
  };

  render() {
    return (
      <Box pad="medium" justify="center" align="center">
        <Dropzone
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
            height: "100px",
            padding: "30px 0",
            border: "2px dashed rgba(0, 0, 0, 0.25)",
            borderRadius: "4px",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            cursor: "pointer"
          }}
          multiple={false}
          onDrop={acceptedFiles => {
            this.setState({ error: null });
            if (acceptedFiles.length > 0) {
              const extension = checkFile(acceptedFiles[0].name);
              if (extension) {
                let reader = new FileReader();

                if (extension == "json") {
                  reader.onload = this.onJSONReaderLoad;
                  reader.readAsText(acceptedFiles[0]);
                } else {
                  reader.onload = this.onYAMLReaderLoad;
                  reader.readAsText(acceptedFiles[0]);
                }
              } else {
                this.setState({
                  error:
                    "File uploaded is not in the correct format (JSON or YAML)"
                });
              }
            }
          }}
        >
          <Box flex={false} direction="row" align="center">
            <FormUploadIcon size="small" />
            <Paragraph margin="none">Browse files</Paragraph>
          </Box>
          <Paragraph margin="small">OR</Paragraph>
          <Paragraph margin="none">Drop your JSON or YAML file here</Paragraph>
        </Dropzone>
        {this.state.error ? (
          <span style={{ color: "red" }}>{this.state.error}</span>
        ) : null}
      </Box>
    );
  }
}

function checkFile(filename) {
  const extension = filename.substr(filename.lastIndexOf(".") + 1);
  if (!/(json|yaml|yml)$/gi.test(extension)) {
    return false;
  } else {
    return extension;
  }
}

JSONDropzone.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func
};

export default JSONDropzone;
