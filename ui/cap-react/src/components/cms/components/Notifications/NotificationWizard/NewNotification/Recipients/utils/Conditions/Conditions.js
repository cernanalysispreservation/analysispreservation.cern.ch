import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import ConditionList from "./ConditionList";
import Button from "../../../../../../../../partials/Button";
import EmptyIcon from "./emptyLogo";
import Label from "grommet/components/Label";
import { Map } from "immutable";

const Conditions = ({
  action = "publish",
  updateCondition,
  updateOperatorByPath,
  updateChecksInConditions,
  checks,
  checkIndex,
  emailType,
  updateValueByPath,
  schema
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
              schema={schema}
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
          {myChecks[0].get("checks").size === 0 && (
            <Box style={{ minWidth: "85px", margin: "0 5px" }}>
              <Button
                text="add simple"
                size="small"
                margin="0 0 5px 0"
                primaryOutline
                onClick={() =>
                  updateChecksInConditions(
                    [],
                    checkIndex,
                    "add",
                    emailType,
                    false
                  )
                }
              />
              <Button
                text="add multiple"
                size="small"
                primaryOutline
                onClick={() =>
                  updateChecksInConditions(
                    [],
                    checkIndex,
                    "add",
                    emailType,
                    true
                  )
                }
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

Conditions.propTypes = {
  action: PropTypes.string,
  updateCondition: PropTypes.func,
  updateOperatorByPath: PropTypes.func,
  updateChecksInConditions: PropTypes.func,
  schema: PropTypes.object,
  emailType: PropTypes.string,
  updateValueByPath: PropTypes.func,
  checkIndex: PropTypes.number,
  checks: PropTypes.object
};

export default Conditions;
