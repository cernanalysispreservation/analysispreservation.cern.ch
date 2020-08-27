import React from "react";
import PropTypes from "prop-types";

const Handle = ({ handle: { id, value, percent }, getHandleProps }) => {
  return (
    <div
      style={{
        left: percent === 100 ? `${95}%` : `${percent}%`,
        position: "absolute",
        marginTop: 15,
        zIndex: 1002,
        width: 15,
        height: 15,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "rgb(40,105,146)",
        color: "#333"
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontSize: 14, marginTop: 25 }}>{value}</div>
    </div>
  );
};

Handle.propTypes = {
  handle: PropTypes.object,
  getHandleProps: PropTypes.func
};

export default Handle;
