import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

import FormLayer from "../components/FormLayer";

class LayerObjectFieldTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false
    };
  }

  _onClick() {
    this.setState({ layerActive: true });
  }

  render() {
    if (this.props.idSchema["$id"] == "root") {
      return <Box>{this.props.properties.map(prop => prop.content)}</Box>;
    } else {
      return (
        <Box className="grommetux-form-field" direction="row" wrap={false}>
          {
            <FormLayer
              layerActive={this.state.layerActive}
              onClose={(() => {
                this.setState({ layerActive: false });
              }).bind(this)}
              properties={this.props.properties.map(prop => prop.content)}
            />
          }
          <Box flex={true}>
            <Box align="center">
              <Label size="small" strong="none" uppercase={true}>
                {this.props.title}
              </Label>
            </Box>

            {this.props.description ? (
              <Paragraph size="small">{this.props.description}</Paragraph>
            ) : null}
          </Box>
        </Box>
      );
    }
  }
}

LayerObjectFieldTemplate.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object
};

export default LayerObjectFieldTemplate;
