import React from "react";
import { useDrag } from "react-dnd";

const style = index => ({
  border: "2px dashed #f6f6f6",
  padding: "5px",
  cursor: "move",
  marginBottom: "6px",
  color: "#fff",
  marginRight: index % 2 == 0 ? "0" : "10px",
  marginLeft: index % 2 == 0 ? "10px" : "0"
});

const DraggableBox = ({ data, children, key }) => {
  const [, drag] = useDrag({
    item: { type: "FIELD_TYPE", data }
  });
  return (
    <div ref={drag} style={style(key)}>
      {children}
    </div>
  );
};

export default DraggableBox;
