import React, { Component } from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Paragraph from "grommet/components/Paragraph";

import _isEmpty from "lodash/isEmpty";

import Dropzone from "react-dropzone";
import yaml from "js-yaml";

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
      <Box>
        <Box justify="center" align="center">
          <Dropzone
            style={{
              display: "flex",
              flex: 1,
              width: "100%",
              height: "50px",
              border: "2px dashed rgba(0, 0, 0, 0.25)",
              borderRadius: "4px",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center"
            }}
            multiple={false}
            onDrop={acceptedFiles => {
              this.setState({ error: null });
              if (acceptedFiles.length > 0) {
                const extension = checkFile(acceptedFiles[0].name);
                if (extension) {
                  var reader = new FileReader();

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
            Drop your JSON or YAML file here
          </Dropzone>
          {this.state.error ? (
            <span style={{ color: "red" }}>{this.state.error}</span>
          ) : null}
          -- OR --
          <Button
            fill={true}
            label="Add/Edit JSON"
            onClick={this.props.actionButtonOnClick}
          />
        </Box>
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
