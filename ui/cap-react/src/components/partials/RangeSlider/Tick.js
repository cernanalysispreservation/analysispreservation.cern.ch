import React from "react";
import PropTypes from "prop-types";

const Tick = props => {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 55,
          marginLeft: -0.5,
          width: 1,
          height: 10,
          backgroundColor: "silver",
          left: `${props.tick.percent}%`
        }}
      />
      <div
        style={{
          position: "absolute",
          marginTop: 65,
          fontSize: 11,
          textAlign: "center",
          marginLeft: `${-(100 / props.count) / 2}%`,
          width: `${100 / props.count}%`,
          left: `${props.tick.percent}%`
        }}
      >
        {props.tick.value}
      </div>
    </div>
  );
};

Tick.propTypes = {
  tick: PropTypes.object,
  count: PropTypes.number
};

export default Tick;
