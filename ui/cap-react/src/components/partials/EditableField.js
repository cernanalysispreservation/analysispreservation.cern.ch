import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const EditableField = ({
  value,
  size = null,
  emptyValue = "Untitled Document",
  renderDisplay = null,
  onUpdate = null,
  isEditable = true,
  cyData = ""
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [hoverTitle, setHoverTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  const _onChange = e => {
    setCurrentValue(e.target.value);
  };

  const _update = () => {
    if (onUpdate) {
      onUpdate(currentValue);
    }
    setHoverTitle(true);
    setEditTitle(false);
  };

  const _unedit = () => {
    setHoverTitle(false);
    setEditTitle(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") _update();
    if (e.key === "Escape") _unedit();
  };

  return editTitle ? (
    <Box
      flex={true}
      direction="row"
      wrap={false}
      pad="none"
      responsive={false}
      className="jst-md-center"
    >
      <Label size={size} margin="none" direction="row">
        <input
          key="draft-input"
          data-cy={cyData}
          style={{ padding: 0, border: "1px solid #136994", borderRadius: 0 }}
          onChange={_onChange}
          value={currentValue}
          autoFocus={true}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
        />
      </Label>
      <Box margin="none" direction="row" align="center" responsive={false}>
        <Box
          pad={{ horizontal: "small" }}
          margin="none"
          onClick={() => _update()}
          data-cy="checkmark"
        >
          <AiOutlineCheck />
        </Box>
        <Box margin="none" onClick={() => _unedit()} data-cy="closeicon">
          <AiOutlineClose colorIndex="neutral-1" size="xsmall" />
        </Box>
      </Box>
    </Box>
  ) : (
    <Box direction="row" wrap={false}>
      <Box
        align="center"
        key="draft-title"
        direction="row"
        responsive={false}
        wrap={false}
        onMouseEnter={() => setHoverTitle(true)}
        onMouseLeave={() => setHoverTitle(false)}
        onClick={
          isEditable
            ? () => {
                setCurrentValue(value);
                setEditTitle(true);
              }
            : null
        }
        style={{
          padding: "0 2px",
          border:
            hoverTitle && isEditable
              ? "1px solid #136994"
              : "1px solid transparent"
        }}
      >
        <Box style={{ marginRight: "5px" }}>
          {renderDisplay ? (
            renderDisplay(value)
          ) : (
            <Label
              size={size}
              align="start"
              pad="none"
              margin="none"
              data-cy="ediatble-value"
            >
              {value || emptyValue}
            </Label>
          )}
        </Box>
        {isEditable && <AiOutlineEdit size="15" />}
      </Box>
    </Box>
  );
};

EditableField.propTypes = {
  renderDisplay: PropTypes.func,
  emptyValue: PropTypes.string,
  value: PropTypes.string,
  onUpdate: PropTypes.func,
  size: PropTypes.string,
  isEditable: PropTypes.bool,
  cyData: PropTypes.string
};

export default EditableField;
