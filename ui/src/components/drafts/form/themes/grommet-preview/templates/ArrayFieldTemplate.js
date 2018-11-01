import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import LayerArrayField from "./LayerArrayField";
import DefaultArrayField from "./DefaultArrayField";
import FieldHeader from "../components/FieldHeader";

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
    if (
      this.formRenderType == "default" ||
      this.formRenderType == "StringArrayField"
    ) {
      return (
        <Box margin={{ top: "small" }}>
          {_label}
          <DefaultArrayField {...this.props} />
        </Box>
      );
    } else if (this.formRenderType == "LayerArrayField") {
      return (
        <Box margin={{ top: "small" }}>
          {_label}
          <LayerArrayField {...this.props} />
        </Box>
      );
    } else if (this.formRenderType == "AccordionArrayField") {
      // return (
      //   <AccordionArrayField
      //     header={<FieldHeader
      //               title={<span>{this.props.title} <i> [{this.props.items.length} items] </i> </span>}
      //               required={this.props.required}
      //               description={this.props.description}
      //               margin="none" />
      //     }
      //     _onAddClick={this._onAddClick.bind(this)}
      //     {...this.props} />
      // );
      // TOFIX Consider changing render type to LayerArrayField
      _label = this.props.title;
      return (
        <Box margin={{ top: "small" }}>
          <FieldHeader title={_label} margin="none" />
          <LayerArrayField {...this.props} />
        </Box>
      );
    }
  }

  render() {
    let _label = (
      <Label margin="none" size="small" strong="none">
        {this.props.title}
      </Label>
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
  required: PropTypes.bool
};

export default ArrayFieldTemplate;
