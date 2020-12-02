import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Box, Label } from "grommet";
import { AiOutlineDownload } from "react-icons/ai";

import { shoudDisplayGuideLinePopUp } from "../../../utils/common";

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
  shouldHideChildren,
  schema
}) {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: "FIELD_TYPE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        if (!item.data) {
          let names = [...item.parent.uiSchema, item.card.name];
          let shouldWeAdd = names.filter(i => !path.uiSchema.includes(i));

          let d = item.parent.schema.filter(i => i !== "items");

          if (d.length === path.schema.length) return;

          shouldWeAdd.length > 0 &&
            addProperty(
              path,
              {
                schema: item.card.prop.content.props.schema,
                uiSchema: item.card.prop.content.props.uiSchema
              },
              item.card.name,
              {
                schema: item.parent.schema,
                uiSchema: item.parent.uiSchema
              }
            );
        } else {
          addProperty(path, item.data.default);
        }
        return { item, path, propKey };
      }
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
      {shoudDisplayGuideLinePopUp(schema) && (
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
  shouldHideChildren: PropTypes.bool,
  schema: PropTypes.object
};

const mapStateToProps = state => ({
  schema: state.schemaWizard.getIn(["current", "schema"])
});

export default connect(
  mapStateToProps,
  null
)(HoverBox);
