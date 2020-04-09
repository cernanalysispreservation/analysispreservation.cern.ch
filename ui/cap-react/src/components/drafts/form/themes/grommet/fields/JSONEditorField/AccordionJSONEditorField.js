import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import JSONDropzone from "./components/JSONDropzone";
import JSONEditorLayer from "./components/JSONEditorLayer";

import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";

import FieldHeader from "../../components/FieldHeader";

import CodeIcon from "grommet/components/icons/base/Code";

import _isEmpty from "lodash/isEmpty";

class JSONEditorWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { editorOpen: false };
  }

  setJSON = data => {
    this.props.onChange(data);
  };

  toggleLayer = () => {
    this.setState({ editorOpen: !this.state.editorOpen });
  };

  render() {
    return (
      <Accordion animate={false} openMulti={false}>
        <AccordionPanel
          heading={
            <FieldHeader
              title={this.props.title || this.props.schema.title}
              required={this.props.required}
              description={this.props.description}
            />
          }
        >
          <Box pad={{ horizontal: "medium" }} margin={{ bottom: "small" }}>
            {_isEmpty(this.props.formData) ||
            JSON.stringify(this.props.formData) === JSON.stringify({}) ? (
              <JSONDropzone
                setJSON={this.setJSON}
                actionButtonOnClick={this.toggleLayer}
              />
            ) : (
              <Box flex={true} size={{ vertical: "small" }}>
                <Box colorIndex="light-2">
                  <Box
                    colorIndex="grey-3"
                    pad="small"
                    direction="row"
                    justify="end"
                    align="center"
                  >
                    <CodeIcon size="xsmall" onClick={this.toggleLayer} />
                  </Box>
                  <div
                    style={{
                      position: "relative",
                      height: "auto",
                      maxHeight: "200px",
                      overflow: "scroll",
                      textOverflow: "hidden"
                    }}
                  >
                    <pre> {JSON.stringify(this.props.formData, null, 4)} </pre>
                  </div>
                </Box>
              </Box>
            )}

            {this.state.editorOpen ? (
              <JSONEditorLayer
                onClose={this.toggleLayer}
                setJSON={this.setJSON}
                value={this.props.formData}
              />
            ) : null}
          </Box>
        </AccordionPanel>
      </Accordion>
    );
  }
}

JSONEditorWidget.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  formData: PropTypes.object,
  title: PropTypes.string,
  required: PropTypes.bool,
  description: PropTypes.string,
  schema: PropTypes.object
};

export default JSONEditorWidget;
