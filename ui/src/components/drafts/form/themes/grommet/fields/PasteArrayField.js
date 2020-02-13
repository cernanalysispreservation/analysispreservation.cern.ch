import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import CleanForm from "../../../CleanForm";
import FieldHeader from "../components/FieldHeader";
import { FormField, Layer } from "grommet";

class PasteArrayField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clipboardData: null
    };

    let { ["ui:options"]: uiOptions = {} } = this.props.uiSchema;
    this._delimiter = uiOptions.delimeter || "\n";
    this.pasteDesctiption =
      uiOptions.pasteDesctiption ||
      "Paste your list here. Insert one item per line:";
    this.pastePlaceholder =
      uiOptions.pastePlaceholder || "ex.\n\nitem1 \n\nitem2 \n\nitem3\n";
  }

  _doBatchImport = () => {
    let value = this.state.clipboardData;
    if (!value) return;

    let values = [];

    // Replace multiple spaces with one
    value = value.replace(/ +(?= )/g, "");
    // Trim whitespaces from beginning/end
    value = value.trim();
    // Remove empty lines
    value = value.replace(/^\s*[\r\n]/gm, "");
    // Split string depending on the delimiter passed in the uiOptionns
    values = value.split(this._delimiter);

    if (Array.isArray(values)) {
      let { items: { type } = {} } = this.props.schema;
      let { ["ui:options"]: { pasteTo } = {} } = this.props.uiSchema;
      if (type == "object" && pasteTo) {
        values = values.map(value => ({ [pasteTo]: value }));
      }

      let _formData;
      if (this.props.formData) _formData = [...this.props.formData, ...values];
      else _formData = values;

      this.props.onChange(_formData);
    }
  };

  _onTextareaChange = ({ target: { value } = {} }) => {
    this.setState({ clipboardData: value });
  };

  _onChange = data => {
    this.props.onChange(data.formData);
  };

  _enableImport = () => {
    this.setState({ importEnabled: !this.state.importEnabled });
  };

  render() {
    let _uiSchema = this.props.uiSchema;

    delete _uiSchema["ui:field"];
    return (
      <FormField>
        <Box pad={{ horizontal: "medium" }}>
          <Box>
            <FieldHeader
              title={this.props.schema.title}
              pasteable={true}
              enableImport={this._enableImport}
              importEnabled={this.state.importEnabled}
              required={this.props.required}
              readonly={this.props.readonly}
              description={this.props.schema.description}
              margin="none"
            />
            {this.state.importEnabled && (
              <Layer
                flush={true}
                closer={true}
                overlayClose={true}
                onClose={this._enableImport}
              >
                <Box
                  flex={false}
                  size="large"
                  colorIndex="light-2"
                  pad="medium"
                >
                  <Box
                    colorIndex="light-2"
                    pad={{
                      between: "small",
                      vertical: "small",
                      horizontal: "small"
                    }}
                    wrap={false}
                    flex={true}
                  >
                    <Box flex={true}>
                      <Box pad={{ vertical: "small" }}>
                        {this.pasteDesctiption}
                      </Box>
                      <Box flex={true}>
                        <textarea
                          value={this.state.clipboardData}
                          rows="20"
                          placeholder={this.pastePlaceholder}
                          style={{
                            borderRadius: "0",
                            backgroundColor: "#fff",
                            height: "100%",
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: "100%",
                            wordBreak: "break-all"
                          }}
                          onChange={this._onTextareaChange}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box
                        flex={false}
                        align="end"
                        direction="row"
                        wrap={false}
                        alignContent="end"
                        justify="end"
                        pad={{ between: "small" }}
                      >
                        <Box
                          direction="row"
                          colorIndex="brand"
                          wrap={false}
                          align="end"
                          separator="all"
                          style={{ padding: "5px" }}
                          onClick={this._doBatchImport}
                        >
                          Import
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Layer>
            )}
          </Box>
          <Box>
            <CleanForm
              schema={this.props.schema}
              uiSchema={{ ..._uiSchema, "ui:pastable": true }}
              formData={this.props.formData}
              onChange={this._onChange}
              liveValidate={true}
            >
              <span />
            </CleanForm>
          </Box>
        </Box>
      </FormField>
    );
  }
}

PasteArrayField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.array
};

export default PasteArrayField;
