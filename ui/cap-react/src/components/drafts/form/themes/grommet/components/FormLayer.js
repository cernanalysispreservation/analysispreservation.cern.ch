import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Button from "grommet/components/Button";

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
        align="center"
        flush={true}
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
                  <Button
                    label="OK"
                    primary={true}
                    onClick={this.props.onClose}
                  />
                </Box>
                <Box>
                  {this.props.remove ? (
                    <Button
                      label="Remove"
                      plain={true}
                      onClick={this.removeAndClose}
                      icon={<Trash />}
                    />
                  ) : null}
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
