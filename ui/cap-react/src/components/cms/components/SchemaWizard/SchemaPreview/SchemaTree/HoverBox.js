import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Box, Label } from "grommet";
import { AiOutlineDownload } from "react-icons/ai";

function getStyle(isOverCurrent) {
  return {
    color: "white",
    textAlign: "center",
    fontSize: "1rem",
    height: "100%",
    border: isOverCurrent ? "1px dotted black " : null
  };
}

function HoverBox({ path, propKey, addProperty, children, index, schema }) {
  // const [hasDropped, setHasDropped] = useState(false);
  // const [results, setResults] = useState({});
  // const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);
  // const ref = useRef(null);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "FIELD_TYPE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
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
    <div ref={drop} style={getStyle(isOverCurrent)} index={index}>
      {Object.keys(schema.toJS().properties).length === 0 && (
        <Box
          style={{ border: "1px dotted black", color: "#000" }}
          pad="medium"
          margin="medium"
          align="center"
          justify="center"
        >
          <Label>Drop Area</Label>
          <AiOutlineDownload size={20} />
        </Box>
      )}
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
  schema: PropTypes.object
};

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"])
});

export default connect(
  mapStateToProps,
  null
)(HoverBox);
