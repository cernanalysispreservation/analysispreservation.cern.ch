import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import ConditionList from "./ConditionList";
import Button from "../../../../../../../../partials/Button";
import EmptyIcon from "./emptyLogo";
import Label from "grommet/components/Label";
import { Map } from "immutable";
import { connect } from "react-redux";
import {
  updateOperatorToCheck,
  updateChecksInConditions,
  updateValueByPath
} from "../../../../../../../../../actions/schemaWizard";

const Conditions = ({
  action = "publish",
  updateCondition,
  updateOperatorByPath,
  updateChecksInConditions,
  checks,
  checkIndex,
  emailType,
  updateValueByPath
}) => {
  let myChecks = [
    Map({
      op: checks.get("op"),
      checks: checks.get("checks")
    })
  ];

  return (
    <Box pad="small">
      {checks.size == 0 && (
        <Box flex pad="small" align="center" justify="center">
          <Box colorIndex="light-2" pad="small">
            <EmptyIcon size="large" />
          </Box>
          <Label>Let's create some conditions and add emails </Label>
          <Button
            text="create conditions"
            primary
            size="large"
            onClick={() => updateCondition(action, "add")}
          />
        </Box>
      )}
      <Box
        separator="all"
        direction="row"
        justify="between"
        style={{
          position: "relative",
          minHeight: "165px"
        }}
        pad={{ horizontal: "small" }}
      >
        <Box
          align="center"
          pad="small"
          justify="start"
          direction="row"
          className="conditionlist-list"
        >
          {myChecks.map((item, index) => (
            <ConditionList
              key={index}
              item={item}
              updateValueByPath={(path, item, condition, val) =>
                updateValueByPath(
                  checkIndex,
                  emailType,
                  path,
                  item,
                  condition,
                  val
                )
              }
              updateConditions={path => {
                updateChecksInConditions(
                  [...path.path],
                  checkIndex,
                  "add",
                  emailType,
                  path.nested
                );
              }}
              updateOperatorByPath={path => {
                updateOperatorByPath(path, checkIndex, emailType);
              }}
              deleteByPath={(path, item) =>
                updateChecksInConditions(
                  [...path, "checks"],
                  checkIndex,
                  "delete",
                  emailType,
                  item
                )
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

Conditions.propTypes = {
  updateSelectedAction: PropTypes.func,
  action: PropTypes.string,
  updateCondition: PropTypes.func,
  updateOperatorByPath: PropTypes.func,
  updateChecksInConditions: PropTypes.func,
  notifications: PropTypes.array
};

const mapStateToProps = state => ({
  notification: state.schemaWizard.get("schemaConfig")
});

const mapDispatchToProps = dispatch => ({
  updateOperatorByPath: (path, index, action) =>
    dispatch(updateOperatorToCheck(path, index, action)),
  updateChecksInConditions: (path, index, howToUpdate, emailType, type) =>
    dispatch(
      updateChecksInConditions(path, index, howToUpdate, emailType, type)
    ),
  updateValueByPath: (checkIndex, emailType, path, item, condition, val) =>
    dispatch(
      updateValueByPath(checkIndex, emailType, path, item, condition, val)
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conditions);
