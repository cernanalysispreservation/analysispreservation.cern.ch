import React from "react";
import PropTypes from "prop-types";
import Layer from "grommet/components/Layer";
import Box from "grommet/components/Box";
import { Provider } from "react-redux";
import store from "../../../store/configureStore";

class SearchFilterLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.active) {
      return (
        <Layer
          closer={true}
          flush={true}
          align="left"
          overlayClose={true}
          onClose={this.props.onClose}
          id="search_layer"
        >
          <Provider store={store}>
            <Box justify="center" align="center" colorIndex="light-2">
              {this.props.properties}
            </Box>
          </Provider>
        </Layer>
      );
    } else return null;
  }
}

SearchFilterLayer.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  properties: PropTypes.node
};

export default SearchFilterLayer;
