import React from "react";
import PropTypes from "prop-types";
import ConditionsCheckBoxes from "./ConditionsCheckBoxes";
import "./ConditionList.css";

const ConditionList = ({
  item,
  updateConditions,
  updateOperatorByPath,
  deleteByPath,
  updateValueByPath,
  schema
}) => {
  return (
    <ConditionsCheckBoxes
      item={item}
      schema={schema}
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
  removeEmail: PropTypes.func,
  updateValueByPath: PropTypes.func,
  schema: PropTypes.object
};

export default ConditionList;
