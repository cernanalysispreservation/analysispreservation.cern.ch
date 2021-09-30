import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Button from "../../../../../partials/Button";

import { AiOutlineDelete } from "react-icons/ai";

import Modal from "../../../../../partials/Modal";

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
      <Modal onClose={this.props.onClose} disableClickHandlers>
        <Box justify="center" align="center" pad="small">
          <Box pad="medium" size={this.props.size || "large"}>
            <Box>{this.props.properties}</Box>

            <Box
              direction="row"
              justify="between"
              pad={{ vertical: "small" }}
              responsive={false}
            >
              <Box>
                {this.props.remove ? (
                  <Button
                    text="Remove"
                    onClick={this.removeAndClose}
                    icon={<AiOutlineDelete size={15} />}
                  />
                ) : null}
              </Box>
              <Box>
                <Button text="OK" primary onClick={this.props.onClose} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
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
  properties: PropTypes.object,
  size: PropTypes.string
};

export default FormLayer;
