import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

const Draggable = ({ data, children }) => {
  const type = "FIELD_TYPE";

  const [, drag] = useDrag({
    item: { type: type, data }
  });
  return (
    <div ref={drag} style={{ cursor: "move" }}>
      {children}
    </div>
  );
};

Draggable.propTypes = {};

export default Draggable;
