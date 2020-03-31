import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FieldHeader from "../components/FieldHeader";

import LayerArrayField from "./LayerArrayField";
import AccordionArrayField from "./AccordionArrayField";
import DefaultArrayField from "./DefaultArrayField";
import StringArrayField from "./StringArrayField";
import AddIcon from "grommet/components/icons/base/Add";
import { Layer } from "grommet";
import axios from "axios";

class ArrayFieldTemplate extends React.Component {
  constructor(props) {
    super(props);

    // IF 'ui:array' is passed render accordingly
    // ELSE IF array items are short (NOT "array"/"object")
    // render without FormLayer (modal)
    // ELSE render the default way
    this.formRenderType = "default";

    this.state = {
      layers: [],
      clipboardData: null
    };
    if ("ui:array" in this.props.uiSchema) {
      this.formRenderType = this.props.uiSchema["ui:array"];
    } else if (
      this.props.schema &&
      this.props.schema.items &&
      ["array", "object"].indexOf(this.props.schema.items.type) != -1
    ) {
      this.formRenderType = "LayerArrayField";
    }
    let { ["ui:options"]: uiOptions = {} } = this.props.uiSchema;
    this.uiOptionImport = uiOptions.import;
    this.uiOptionLatex = uiOptions.latex;
    this._delimiter = uiOptions.delimeter || "\n";
    this.pasteDesctiption =
      this.uiOptionImport && this.uiOptionImport.description
        ? this.uiOptionImport.description
        : "Paste your list here. Insert one item per line:";
    this.pastePlaceholder =
      this.uiOptionImport && this.uiOptionImport.placeholder
        ? this.uiOptionImport.placeholder
        : "ex.\n\nitem1 \n\nitem2 \n\nitem3\n";
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

    // Get form configurations/options
    let { items: { type } = {} } = this.props.schema;

    let pasteTo = this.uiOptionImport.to;

    if (Array.isArray(values)) {
      let _formData = this.props.formData;
      let _formDataLength = _formData.length;

      let e = new Event("e");
      setTimeout(() => {
        values.map((value, index) => {
          let _index = _formDataLength + index;
          this.props.onAddClick(e);

          if (type == "object" && pasteTo) {
            value = { [pasteTo]: value };
          }
          this.props.items[_index].children.props.onChange(value);
        });
      }, 1);

      this.setState({
        clipboardData: null,
        importEnabled: !this.state.importEnabled
      });
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

  _enableLatex = () => {
    let { items: { type } = {} } = this.props.schema;
    let pasteTo = this.uiOptionImport.to;

    let data = this.props.formData;
    if (type == "object" && pasteTo) {
      data = this.props.formData.map(item => item[pasteTo] || "");
    }

    if (!this.state.latexEnabled) {
      axios
        .post("/api/services/latex", {
          title: this.props.schema.title || "Title goes here",
          paths: data
        })
        .then(resp => {
          this.setState({
            latexData: resp.data.latex,
            latexEnabled: !this.state.latexEnabled
          });
        });
    } else {
      this.setState({
        latexData: null,
        latexEnabled: !this.state.latexEnabled
      });
    }
  };

  _onAddClick(event) {
    this.setState({ layers: this.state.layers.concat([true]) });
    this.props.onAddClick(event);
  }

  _renderAddButton = () => (
    <Box
      onClick={this._onAddClick.bind(this)}
      style={{ padding: "5px", margin: "10px 0" }}
      colorIndex="light-1"
      direction="row"
      justify="center"
      align="center"
      flex={false}
    >
      <AddIcon size="xsmall" />{" "}
      <span style={{ marginLeft: "5px" }}>Add Item</span>
    </Box>
  );

  _getArrayField = _label => {
    let _pastable = this.props.uiSchema && !this.props.uiSchema["ui:pastable"];
    if (this.formRenderType == "default") {
      return (
        <Box className={_pastable ? "grommetux-form-field" : null}>
          {_pastable && _label}
          <DefaultArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
          {this._renderAddButton()}
        </Box>
      );
    } else if (this.formRenderType == "StringArrayField") {
      return (
        <Box className={_pastable ? "grommetux-form-field" : null}>
          {this.props.uiSchema && !this.props.uiSchema["ui:pastable"] && _label}
          <StringArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
          {this._renderAddButton()}
        </Box>
      );
    } else if (this.formRenderType == "LayerArrayField") {
      return (
        <Box className={_pastable ? "grommetux-form-field" : null}>
          {this.props.uiSchema && !this.props.uiSchema["ui:pastable"] && _label}
          <LayerArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
          {this._renderAddButton()}
        </Box>
      );
    } else if (this.formRenderType == "AccordionArrayField") {
      return (
        <AccordionArrayField
          header={
            <FieldHeader
              title={
                <span>
                  {this.props.title} <i> [{this.props.items.length} items] </i>{" "}
                </span>
              }
              required={this.props.required}
              readonly={this.props.readonly}
              description={this.props.schema.description}
              margin="none"
            />
          }
          _onAddClick={this._onAddClick.bind(this)}
          {...this.props}
        />
      );
    } else {
      return <div>{this.props.schema.items.type}</div>;
    }
  };

  render() {
    let _label = (
      <FieldHeader
        title={this.props.title}
        required={this.props.required}
        readonly={this.props.readonly}
        description={this.props.description}
        onArrayAddClick={this._onAddClick.bind(this)}
        pasteable={this.uiOptionImport}
        enableImport={this.uiOptionImport && this._enableImport}
        enableLatex={this.uiOptionLatex && this._enableLatex}
        latexEnabled={this.uiOptionLatex && this.state.latexEnabled}
        importEnabled={this.uiOptionLatex && this.state.importEnabled}
        margin="none"
      />
    );
    return (
      <Box
        size={
          this.props.uiSchema &&
          this.props.uiSchema["ui:options"] &&
          this.props.uiSchema["ui:options"].size
            ? this.props.uiSchema["ui:options"].size
            : "full"
        }
        style={{
          display:
            this.props.uiSchema &&
            this.props.uiSchema["ui:options"] &&
            this.props.uiSchema["ui:options"].display
              ? this.props.uiSchema["ui:options"].display
              : "flex"
        }}
      >
        {this.uiOptionLatex &&
          this.state.latexEnabled && (
            <LatexPreviewer
              data={this.state.latexData}
              onClose={this._enableLatex}
            />
          )}
        {this.state.importEnabled && (
          <Layer
            flush={true}
            closer={true}
            overlayClose={true}
            onClose={this._enableImport}
          >
            <Box flex={false} size="large" colorIndex="light-2" pad="medium">
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
                  <Box pad={{ vertical: "small" }}>{this.pasteDesctiption}</Box>
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
        {this._getArrayField(_label)}
      </Box>
    );
  }
}

ArrayFieldTemplate.propTypes = {
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  onAddClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  items: PropTypes.array,
  readonly: PropTypes.bool
};

export default ArrayFieldTemplate;
