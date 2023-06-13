import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function getStyle(isOverCurrent) {
  const style = {
    textAlign: "center",
    height: "100%",
  };

  return isOverCurrent
    ? {
        outline: "1px solid #006996",
        outlineOffset: "-1px",
        ...style,
      }
    : style;
}

function HoverBox({
  path,
  propKey,
  addProperty,
  children,
  shouldHideChildren,
}) {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "FIELD_TYPE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();

      if (!didDrop && !shouldHideChildren) {
        addProperty(path, item.data.default);
        return { item, path, propKey };
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div ref={drop} style={getStyle(isOverCurrent)}>
      {children}
    </div>
  );
}

HoverBox.propTypes = {
  children: PropTypes.element,
  path: PropTypes.array,
  addProperty: PropTypes.func,
  propKey: PropTypes.string,
  shouldHideChildren: PropTypes.bool,
  schema: PropTypes.object,
};

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"]),
});

export default connect(mapStateToProps, null)(HoverBox);
