import React from "react";
import PropTypes from "prop-types";

import { Box, List, ListItem } from "grommet";

import FormLayer from "../components/FormLayer";
import ItemBrief from "../components/ItemBrief";

class ArrayFieldTemplate extends React.Component {
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
      <Box flex={false} size={{ height: { max: "small" } }}>
        <List selectable={false}>
          {this.props.items.length > 0 ? (
            this.props.items.map(element => (
              <ListItem
                key={element.index}
                onClick={this._showLayer.bind(this, element.index)}
                separator="none"
                flex={true}
                margin="none"
                pad="none"
                justify="between"
              >
                <FormLayer
                  layerActive={this.state.layers[element.index]}
                  onClose={this._onFormLayerClose.bind(this, element.index)}
                  properties={element.children}
                />
                <Box flex={true} direction="row" wrap={false}>
                  <Box flex={true} pad="small">
                    <ItemBrief
                      index={element.index}
                      item={element.children.props.formData}
                      label={
                        this.props.uiSchema.label ||
                        (this.props.title || "Item")
                      }
                    />
                  </Box>
                </Box>
              </ListItem>
            ))
          ) : (
            <Box colorIndex="light-2" pad="small" margin={{ top: "small" }}>
              No {this.props.title} provided.
            </Box>
          )
          // <ListPlaceholder
          //   emptyMessage='You do not have any items at the moment.'
          //   unfilteredTotal={0}/>
          }
        </List>
      </Box>
    );
  }
}

ArrayFieldTemplate.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  items: PropTypes.array,
  properties: PropTypes.object,
  onAddClick: PropTypes.func
};

export default ArrayFieldTemplate;
