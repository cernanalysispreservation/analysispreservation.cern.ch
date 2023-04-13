import PropTypes from "prop-types";
import { Button, Empty } from "antd";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

const EmptyArrayField = ({
  canAdd,
  onAddClick,
  disabled,
  readonly,
  options,
}) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      imageStyle={{
        height: 35,
      }}
      style={{ margin: "5px" }}
      description={"No Items added"}
    >
      {canAdd &&
        !readonly && (
          <Button
            className="array-item-add"
            disabled={disabled}
            onClick={onAddClick}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Add {options && options.addLabel ? options.addLabel : `Item`}
          </Button>
        )}
    </Empty>
  );
};

EmptyArrayField.propTypes = {
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  canAdd: PropTypes.bool,
};

export default EmptyArrayField;
