import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";

function getStyle(isOverCurrent) {
  return {
    color: "white",
    textAlign: "center",
    fontSize: "1rem",
    height: "100%",
    border: isOverCurrent ? "1px dotted black " : null
  };
}

function HoverBox({
  path,
  propKey,
  addProperty,
  children,
  index,
  shouldHideChildren
}) {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "FIELD_TYPE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();

      if (!didDrop && !shouldHideChildren) {
        addProperty(path, item.data.default);
        return { item, path, propKey };
      }
      // setHasDropped(true);
      // setHasDroppedOnChild(didDrop);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  return (
    <div
      ref={drop}
      style={getStyle(isOverCurrent && !shouldHideChildren)}
      index={index}
    >
      {children}
    </div>
  );
}

HoverBox.propTypes = {
  children: PropTypes.element,
  path: PropTypes.array,
  addProperty: PropTypes.func,
  propKey: PropTypes.string,
  index: PropTypes.number,
  shouldHideChildren: PropTypes.bool
};

export default HoverBox;
