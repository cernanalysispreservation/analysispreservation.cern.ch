import React from "react";
import SortableBox from "./SortableBox";

const RenderSortable = (parent, card, i, moveCard) => {
  if (card === undefined) {
    return null;
  }
  return (
    <SortableBox
      parent={parent}
      key={card.id}
      index={i}
      id={card.id}
      text={card.text}
      moveCard={moveCard}
    >
      {card.prop.content}
    </SortableBox>
  );
};

export default RenderSortable;
