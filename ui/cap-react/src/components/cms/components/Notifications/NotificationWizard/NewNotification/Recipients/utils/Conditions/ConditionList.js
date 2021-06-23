import React from "react";
import PropTypes from "prop-types";
import ConditionsCheckBoxes from "./ConditionsCheckBoxes";
import "./ConditionList.css";

const ConditionList = ({
  item,
  updateConditions,
  updateOperatorByPath,
  deleteByPath,
  updateValueByPath
}) => {
  return (
    <ConditionsCheckBoxes
      item={item}
      initial
      updateConditions={updateConditions}
      updateOperatorByPath={updateOperatorByPath}
      deleteByPath={deleteByPath}
      updateValueByPath={updateValueByPath}
    />
  );
};

ConditionList.propTypes = {
  item: PropTypes.object,
  updateConditions: PropTypes.func,
  updateOperatorByPath: PropTypes.func,
  updateEmailList: PropTypes.func,
  deleteByPath: PropTypes.func,
  removeEmail: PropTypes.func
};

export default ConditionList;
