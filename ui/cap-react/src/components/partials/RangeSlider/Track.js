import React from "react";
import PropTypes from "prop-types";

const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: "absolute",
        height: 5,
        zIndex: 1,
        marginTop: 20,
        backgroundColor: "rgb(61,149,209)",
        borderRadius: 5,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
};

Track.propTypes = {
  source: PropTypes.object,
  target: PropTypes.object,
  getTrackProps: PropTypes.func
};

export default Track;
