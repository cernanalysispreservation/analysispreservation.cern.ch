import React, { useState } from "react";
import { useDrop } from "react-dnd";

function getStyle(backgroundColor, isOverCurrent) {
  return {
    color: "white",
    //backgroundColor,
    textAlign: "center",
    fontSize: "1rem",
    height: "100%",
    border: isOverCurrent ? "1px dashed black " : null
  };
}

function HoverBox({ path, propKey, addProperty, children }) {
  const [hasDropped, setHasDropped] = useState(false);
  const [results, setResults] = useState({});
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, resultss }, drop] = useDrop({
    accept: ["FIELD_TYPE", "NESTED_TYPE"],
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        addProperty(path, item.data.default);
        return { item, path, propKey };
      }
      setHasDropped(true);
      setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  let backgroundColor;
  if (isOverCurrent) {
    backgroundColor = "darkgreen";
  }
  return (
    <div ref={drop} style={getStyle(backgroundColor, isOverCurrent)}>
      {children}
    </div>
  );
}

export default HoverBox;
