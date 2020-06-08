import React from "react";
import PropTypes from "prop-types";
import Layer from "grommet/components/Layer";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

const RouteGuardModal = ({ show, onCancel, onConfirm }) => {
  if (show) {
    return (
      <Layer closer={true} flush={true} overlayClose={true} onClose={onCancel}>
        <Box colorIndex="light-2" pad="large">
          <Paragraph margin="none">You are about to exit your draft</Paragraph>
          <Paragraph margin="none">
            Make sure all your changes have been saved
          </Paragraph>
          <Box
            direction="row"
            flex={true}
            pad={{ between: "medium" }}
            justify="between"
            align="center"
            responsive={false}
            margin={{ top: "large" }}
          >
            <Box
              align="center"
              separator="all"
              colorIndex="light-2"
              pad={{ horizontal: "medium", vertical: "small" }}
              onClick={onCancel}
            >
              Cancel
            </Box>
            <Box
              align="center"
              pad={{ horizontal: "medium", vertical: "small" }}
              colorIndex="brand"
              onClick={onConfirm}
            >
              I am sure
            </Box>
          </Box>
        </Box>
      </Layer>
    );
  } else {
    return null;
  }
};

RouteGuardModal.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default RouteGuardModal;
