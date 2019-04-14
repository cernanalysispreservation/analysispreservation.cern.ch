import React, { useState } from "react";
import { useDrop } from "react-dnd";

function getStyle(backgroundColor) {
  return {
    color: "white",
    backgroundColor,
    textAlign: "center",
    fontSize: "1rem"
  };
}

function HoverBox({ path, propKey, addProperty, children }) {
  const [hasDropped, setHasDropped] = useState(false);
  const [results, setResults] = useState({});
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  const [{ isOver, isOverCurrent, resultss }, drop] = useDrop({
    accept: "FIELD_TYPE",
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
    <div ref={drop} style={getStyle(backgroundColor)}>
      {children}
    </div>
  );
}

export default HoverBox;
