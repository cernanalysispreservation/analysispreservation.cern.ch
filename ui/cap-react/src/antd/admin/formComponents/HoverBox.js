import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { shoudDisplayGuideLinePopUp } from "../utils";
import { Space, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

function getStyle(isOverCurrent) {
  return {
    textAlign: "center",
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

      if (!didDrop && !shouldHideChildren) {
        addProperty(path, item.data.default);
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
        <Space
          style={{
            border: "1px dotted black",
            color: "#000",
            width: "100%",
            height: "100%",
            padding: "40px"
          }}
          direction="vertical"
        >
          <Typography.Text>Drop Area</Typography.Text>
          <DownloadOutlined />
        </Space>
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
