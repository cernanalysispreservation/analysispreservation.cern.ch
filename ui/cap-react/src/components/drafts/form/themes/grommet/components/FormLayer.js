import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";

import Button from "../../../../../partials/Button";

import Trash from "grommet/components/icons/base/Trash";

import { Provider } from "react-redux";
import store from "../../../../../../store/configureStore";

class FormLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  removeAndClose = () => {
    this.props.remove();
    this.props.onClose();
  };

  render() {
    return this.props.layerActive ? (
      <Layer
        closer={true}
        align="right"
        flush={false}
        onClose={this.props.onClose}
        overlayClose={true}
      >
        <Provider store={store}>
          <Box justify="center" align="center" pad="large">
            <Box pad="large" size="large">
              <Box>{this.props.properties}</Box>

              <Box
                direction="row"
                justify="between"
                pad={{ vertical: "small" }}
              >
                <Box>
                  {this.props.remove ? (
                    <Button
                      text="Remove"
                      plain={true}
                      onClick={this.removeAndClose}
                      icon={<Trash />}
                    />
                  ) : null}
                </Box>
                <Box>
                  <Button
                    text="OK"
                    primary={true}
                    onClick={this.props.onClose}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Provider>
      </Layer>
    ) : null;
  }
}

FormLayer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  layerActive: PropTypes.bool,
  remove: PropTypes.func,
  onClose: PropTypes.func,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object
};

export default FormLayer;
