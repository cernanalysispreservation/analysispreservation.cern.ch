import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.1rem",
  cursor: "move",
};
const Draggable = ({ data, children }) => {
  const type = "FIELD_TYPE";
  const [{ isDragging }, drag] = useDrag({
    item: { type, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  });
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} style={{ ...style, opacity }}>
      {children}
    </div>
  );
};

Draggable.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};

export default Draggable;
