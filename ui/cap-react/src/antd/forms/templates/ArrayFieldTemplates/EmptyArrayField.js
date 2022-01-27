import React from "react";
import PropTypes from "prop-types";
import { Button, Empty } from "antd";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

const EmptyArrayField = ({ items, onAddClick, disabled, readonly }) => {
  return (
    items &&
    items.length == 0 && (
      <Empty
        imageStyle={{
          height: 60
        }}
        description={"No Items added"}
      >
        <Button
          className="array-item-add"
          disabled={disabled || readonly}
          onClick={onAddClick}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Add Item
        </Button>
      </Empty>
    )
  );
};

EmptyArrayField.propTypes = {
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool
};

export default EmptyArrayField;
