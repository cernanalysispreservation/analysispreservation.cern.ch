import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Row, Space, Typography } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

const EditableField = ({
  text,
  isEditable = false,
  emptyValue = "Untitled Document",
  onUpdate = () => {}
}) => {
  const [editMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(text);

  const handleApprove = () => {
    onUpdate(currentValue);
    setEditMode(false);
  };

  const handleReject = () => {
    setEditMode(false);
    setCurrentValue(text);
  };

  const handleKeyDown = e => {
    if (e.key == "Escape") handleReject();
  };

  return !editMode ? (
    <Space direction="horizontal">
      <Typography.Text>{text || emptyValue}</Typography.Text>
      {isEditable && <EditOutlined onClick={() => setEditMode(true)} />}
    </Space>
  ) : (
    <Space direction="horizontal">
      <Input
        value={currentValue}
        onChange={e => setCurrentValue(e.target.value)}
        onPressEnter={handleApprove}
        onKeyDown={handleKeyDown}
        autoFocus={true}
      />
      <CheckOutlined onClick={handleApprove} style={{ color: "#389e0d" }} />
      <CloseOutlined style={{ color: "#cf1322" }} onClick={handleReject} />
    </Space>
  );
};

EditableField.propTypes = {
  text: PropTypes.string,
  emptyValue: PropTypes.string,
  onUpdate: PropTypes.func,
  isEditable: PropTypes.bool
};

export default EditableField;
