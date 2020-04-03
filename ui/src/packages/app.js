import React from "react";
import PropTypes from "prop-types";

const Playground = ({ name = "Antonios" }) => {
  return <div>{name}</div>;
};

Playground.propTypes = {
  name: PropTypes.string
};

export default Playground;
