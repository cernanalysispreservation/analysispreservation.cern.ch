import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FieldHeader from "../components/FieldHeader";

import LayerArrayField from "./LayerArrayField";
import AccordionArrayField from "./AccordionArrayField";
import DefaultArrayField from "./DefaultArrayField";
import StringArrayField from "./StringArrayField";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import LatexPreviewer from "../../../../../../components/latex/latex";
import ImportLayer from "../components/ImportLayer";
import Button from "../../../../../partials/Button";
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
      clipboardData: ""
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
    this.uiOptions = uiOptions;
    this.uiOptionImport = uiOptions.import;
    this.uiOptionLatex = uiOptions.latex;
    this._delimiter = uiOptions.delimeter || "\n";
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

  _updateImportLayerAll = (items = [], add = true) => {
    let updated = items.map(item => item + "\n");

    if (!this.state.clipboardData) {
      this.setState({ clipboardData: updated.join(",").replace(/,/g, "") });
    } else {
      if (add) {
        this.setState({
          clipboardData:
            this.state.clipboardData +
            updated
              .filter(item => !this.state.clipboardData.includes(item))
              .join(",")
              .replace(/,/g, "")
        });
      } else {
        let clips = this.state.clipboardData;
        updated.map(item => {
          if (this.state.clipboardData.includes(item)) {
            clips = clips.replace(item, "");
          }
        });

        this.setState({
          clipboardData: clips
        });
      }
    }
  };

  _updateImportLayerClipboard = item => {
    if (this.state.clipboardData) {
      if (!this.state.clipboardData.includes(item)) {
        this.setState({
          clipboardData: this.state.clipboardData + item + "\n"
        });
      } else {
        this.setState({
          clipboardData: this.state.clipboardData.replace(item + "\n", "")
        });
      }
    } else {
      this.setState({ clipboardData: item + "\n" });
    }
  };
  _onTextareaChange = ({ target: { value } = {} }) => {
    this.setState({ clipboardData: value });
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

  _renderAddButton = () =>
    !this.props.readonly && (
      <Box align="center">
        <Button
          margin="5px 0 0 0 "
          icon={<AiOutlinePlus size={20} />}
          text="Add Item"
          size="small"
          onClick={this._onAddClick.bind(this)}
          className="fieldTemplate-btn"
        />
      </Box>
    );

  _getArrayField = _label => {
    let _pastable = this.props.uiSchema && !this.props.uiSchema["ui:pastable"];
    if (this.formRenderType == "default") {
      return (
        <Box>
          {_pastable && _label}
          <Box flex={false}>
            <DefaultArrayField
              _onAddClick={this._onAddClick.bind(this)}
              {...this.props}
            />
            {this._renderAddButton()}
          </Box>
        </Box>
      );
    } else if (this.formRenderType == "StringArrayField") {
      return (
        <Box>
          {this.props.uiSchema && !this.props.uiSchema["ui:pastable"] && _label}
          <Box flex={false}>
            <StringArrayField
              _onAddClick={this._onAddClick.bind(this)}
              {...this.props}
            />
            {this._renderAddButton()}
          </Box>
        </Box>
      );
    } else if (this.formRenderType == "LayerArrayField") {
      return (
        <Box>
          {this.props.uiSchema && !this.props.uiSchema["ui:pastable"] && _label}
          <Box flex={false}>
            <LayerArrayField
              _onAddClick={this._onAddClick.bind(this)}
              size={this.uiOptions.layerSize}
              {...this.props}
            />
            {this._renderAddButton()}
          </Box>
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
              descriptionStyle={{ display: "block" }}
              uiSchema={this.props.uiSchema}
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

  render = () => {
    let _label = (
      <FieldHeader
        title={this.props.title}
        required={this.props.required}
        readonly={this.props.readonly}
        description={this.props.schema && this.props.schema.description}
        onArrayAddClick={this._onAddClick.bind(this)}
        pasteable={this.uiOptionImport}
        enableImport={this.uiOptionImport && this._enableImport}
        enableLatex={this.uiOptionLatex && this._enableLatex}
        latexEnabled={this.uiOptionLatex && this.state.latexEnabled}
        importEnabled={this.uiOptionLatex && this.state.importEnabled}
        margin={{ bottom: "small" }}
        descriptionStyle={{ display: "block" }}
        uiSchema={this.props.uiSchema}
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
              : "flex",
          padding: "0!important"
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
          <ImportLayer
            enableImport={this.uiOptionImport && this._enableImport}
            options={this.uiOptionImport}
            data={this.state.clipboardData}
            onDataChange={this._onTextareaChange}
            onImport={this._doBatchImport}
            updateAll={(items, add) => this._updateImportLayerAll(items, add)}
            updateClipboard={item => this._updateImportLayerClipboard(item)}
          />
        )}
        {this._getArrayField(_label)}
      </Box>
    );
  };
}

ArrayFieldTemplate.propTypes = {
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  onAddClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  items: PropTypes.array,
  readonly: PropTypes.bool,
  formData: PropTypes.array
};

export default ArrayFieldTemplate;
