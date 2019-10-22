import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";

import Button from "grommet/components/Button";
import AddIcon from "grommet/components/icons/base/Add";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import FormTrashIcon from "grommet/components/icons/base/FormTrash";

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
              {this.props.items.map(element => (
                <Box direction="row" flex={true}>
                  <Box flex={true}>{element.children}</Box>
                  <Box flex={false}>
                    <Button
                      onClick={event =>
                        element.onDropIndexClick(element.index)(event)
                      }
                      icon={this.props.readonly ? null : <FormTrashIcon />}
                    />
                  </Box>
                </Box>
              ))}
              <Box justify="center" align="center">
                <Button
                  onClick={this._onAddClick.bind(this)}
                  icon={<AddIcon />}
                />
              </Box>
            </Box>
          ) : (
            <ListPlaceholder
              addControl={
                this.props.readonly ? null : (
                  <Button
                    onClick={this._onAddClick.bind(this)}
                    icon={<AddIcon />}
                  />
                )
              }
              emptyMessage="You do not have any items at the moment."
              unfilteredTotal={0}
            />
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
  onAddClick: PropTypes.func,
  readonly: PropTypes.bool
};

export default AccordionArrayField;
