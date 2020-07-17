import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FormField from "grommet/components/FormField";

import JSONDropzone from "./components/JSONDropzone";

import Anchor from "../../../../../../partials/Anchor";

// import jsonWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-json";
// ace.config.setModuleUrl("ace/mode/json_worker", jsonWorkerUrl);

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
// import "ace-builds";

// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";

class JSONEditorWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { editorOpen: false };
  }

  setJSON = data => {
    let _data;
    try {
      _data = JSON.parse(data);
    } catch (e) {
      return;
    }
    this.props.onChange(_data);
  };

  toggleLayer = () => {
    this.setState({ editorOpen: !this.state.editorOpen });
  };

  render() {
    let {
      id,
      schema: { title: title = id, description: rawDescription = null } = {}
    } = this.props;

    return (
      <FormField
        label={
          <Box flex={true} justify="between" direction="row">
            <Box flex={true}>
              <span style={{ color: "#000" }}>{title}</span>
              {rawDescription ? (
                <span style={{ color: "#bbb" }}> &nbsp; {rawDescription}</span>
              ) : null}
            </Box>
            <Anchor
              label={
                this.state.editorOpen
                  ? "back to Editor"
                  : "Import JSON/YAML file"
              }
              onClick={this.toggleLayer}
            />
          </Box>
        }
        key={id}
      >
        <Box
          margin={{ horizontal: "medium", vertical: "small" }}
          colorIndex="light-2"
        >
          {this.state.editorOpen ? (
            <JSONDropzone
              setJSON={this.setJSON}
              actionButtonOnClick={this.toggleLayer}
            />
          ) : (
            <Box flex={false}>
              <AceEditor
                mode="json"
                theme="github"
                width="100%"
                name="UNIQUE_ID_OF_DIV"
                value={JSON.stringify(this.props.formData, null, 4)}
                onChange={this.setJSON}
                editorProps={{ $blockScrolling: true }}
              />
            </Box>
          )}
        </Box>
      </FormField>
    );
  }
}

JSONEditorWidget.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  schema: PropTypes.object,
  formData: PropTypes.object
};

export default JSONEditorWidget;
