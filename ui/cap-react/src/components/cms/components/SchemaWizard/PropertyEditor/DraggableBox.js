import React from "react";
import { useDrag } from "react-dnd";
import PropTypes from "prop-types";

const style = index => ({
  border: "1px dotted #f6f6f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  cursor: "move",
  marginBottom: "6px",
  color: "#fff",
  marginRight: index % 2 == 0 ? "0" : "10px",
  marginLeft: index % 2 == 0 ? "10px" : "0"
});

const DraggableBox = ({ data, children, key }) => {
  const type = "FIELD_TYPE";

  const [, drag] = useDrag({
    item: { type: type, data }
  });

  return (
    <div ref={drag} style={style(key)}>
      {children}
    </div>
  );
};

DraggableBox.propTypes = {
  children: PropTypes.element,
  data: PropTypes.object,
  key: PropTypes.number
};

export default DraggableBox;
