import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Header from "grommet/components/Header";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

export default class SchemasLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.activeLayer ? (
      <Layer
        flush={true}
        pad="none"
        closer={true}
        overlayClose={true}
        onClose={this.props.toggleLayer}
      >
        <Box size="large" pad="none">
          <Header
            flex={false}
            size="small"
            justify="center"
            pad={{ horizontal: "small" }}
            margin="none"
            colorIndex="grey-3"
          >
            Select schema to edit
          </Header>
          <List>
            {this.props.schemas.map(key => (
              <ListItem
                key={key}
                onClick={this.props.selectSchema.bind(this, key)}
              >
                <Box>{key}</Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Layer>
    ) : null;
  }
}

SchemasLayer.propTypes = {
  toggleLayer: PropTypes.func,
  selectSchema: PropTypes.func,
  schemas: PropTypes.array.isRequired,
  activeLayer: PropTypes.bool.isRequired
};
