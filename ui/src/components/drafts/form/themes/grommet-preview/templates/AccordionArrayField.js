import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";

class AccordionArrayField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layers: []
    };
  }

  _onAddClick(event) {
    this.setState({ layers: this.state.layers.concat([true]) });
    this.props.onAddClick(event);
  }

  _onFormLayerClose(index) {
    const layers = this.state.layers;
    layers[index] = false;
    this.setState({ layers: layers });
  }

  _showLayer(index) {
    const layers = this.state.layers;
    layers[index] = true;
    this.setState({ layers: layers });
  }

  render() {
    return (
      <Accordion key={this.props.header} animate={false} openMulti={false}>
        <AccordionPanel heading={this.props.header}>
          {this.props.items.length > 0 ? (
            <Box pad="medium" colorIndex="light-2">
              {this.props.items.map(element => element.children)}
            </Box>
          ) : (
            <Box colorIndex="light-2" pad="small" margin={{ top: "small" }}>
              No {this.props.title} provided.
            </Box>
          )}
        </AccordionPanel>
      </Accordion>
    );
  }
}

AccordionArrayField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  items: PropTypes.array,
  properties: PropTypes.object,
  header: PropTypes.object,
  onAddClick: PropTypes.func
};

export default AccordionArrayField;
