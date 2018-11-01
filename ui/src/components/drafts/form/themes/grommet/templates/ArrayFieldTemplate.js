import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import FieldHeader from "../components/FieldHeader";

import LayerArrayField from "./LayerArrayField";
import AccordionArrayField from "./AccordionArrayField";
import DefaultArrayField from "./DefaultArrayField";
import StringArrayField from "./StringArrayField";

class ArrayFieldTemplate extends React.Component {
  constructor(props) {
    super(props);

    // IF 'ui:array' is passed render accordingly
    // ELSE IF array items are short (NOT "array"/"object")
    // render without FormLayer (modal)
    // ELSE render the default way
    this.formRenderType = "default";

    this.state = {
      layers: []
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
  }

  _onAddClick(event) {
    this.setState({ layers: this.state.layers.concat([true]) });
    this.props.onAddClick(event);
  }

  _getArrayField(_label) {
    if (this.formRenderType == "default") {
      return (
        <Box className="grommetux-form-field">
          {_label}
          <DefaultArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
        </Box>
      );
    } else if (this.formRenderType == "StringArrayField") {
      return (
        <Box className="grommetux-form-field">
          {_label}
          <StringArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
        </Box>
      );
    } else if (this.formRenderType == "LayerArrayField") {
      return (
        <Box className="grommetux-form-field">
          {_label}
          <LayerArrayField
            _onAddClick={this._onAddClick.bind(this)}
            {...this.props}
          />
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
  }

  render() {
    let _label = (
      <FieldHeader
        title={this.props.title}
        required={this.props.required}
        description={this.props.description}
        onArrayAddClick={this._onAddClick.bind(this)}
        margin="none"
      />
    );

    return this._getArrayField(_label);
  }
}

ArrayFieldTemplate.propTypes = {
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  onAddClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  items: PropTypes.array
};

export default ArrayFieldTemplate;
