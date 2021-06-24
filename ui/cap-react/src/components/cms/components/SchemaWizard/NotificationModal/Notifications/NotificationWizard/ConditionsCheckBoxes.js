import React from "react";
import PropTypes from "prop-types";
import Tag from "../../../../../../partials/Tag";
import Button from "../../../../../../partials/Button";
import { Box } from "grommet";
import { AiOutlineClose } from "react-icons/ai";

const ConditionsCheckBoxes = ({
  item,
  initial,
  path = [],
  updateConditions,
  index = undefined,
  updateOperatorByPath,
  deleteByPath = { deleteByPath }
}) => {
  path = [...path, index ? { checks: "checks", index } : "checks"];
  if (item.has("op") && item.has("checks")) {
    return item.get("checks").map((items, index) => (
      <Box
        key={index}
        direction="row"
        align="center"
        style={{ minWidth: "max-content" }}
      >
        <Box
          direction="row"
          align="center"
          separator={items.op && items.checks && "all"}
          pad="small"
          style={{ minWidth: "max-content", position: "relative" }}
          colorIndex={path.length % 2 === 0 ? "light-1" : "light-2"}
          margin={{ horizontal: "medium" }}
        >
          <ConditionsCheckBoxes
            item={items}
            path={path}
            index={index}
            updateConditions={updateConditions}
            updateOperatorByPath={updateOperatorByPath}
            deleteByPath={deleteByPath}
          />

          <Box style={{ position: "absolute", right: -10, top: -10 }}>
            <Button
              icon={<AiOutlineClose />}
              size="iconSmall"
              criticalOutline
              rounded
              onClick={() => deleteByPath([...path, { item: items, index }])}
            />
          </Box>
        </Box>
        {index !== item.get("checks").size - 1 && (
          <Box onClick={() => updateOperatorByPath(path)}>
            <Tag
              margin="0 10px"
              text={<b>{item.get("op")}</b>}
              color={{
                bgcolor: "#c41d7f",
                border: "#fff0f6",
                color: "#ffadd2"
              }}
              size="large"
            />
          </Box>
        )}

        {index === item.get("checks").size - 1 &&
          !initial && (
            <Box>
              <Button
                text="add simple"
                size="small"
                margin="0 0 5px 0"
                primaryOutline
                onClick={() => updateConditions({ nested: false, path: path })}
              />
              <Button
                text="add multiple"
                size="small"
                primaryOutline
                onClick={() => updateConditions({ nested: true, path: path })}
              />
            </Box>
          )}
      </Box>
    ));
  }

  return (
    <Box direction="row" responsive={false} separator="all" pad="small">
      <Tag text={item.get("path")} size="large" />
      <Tag text={item.get("if")} size="large" />
      <Tag text={item.get("value")} size="large" />
    </Box>
  );
};

ConditionsCheckBoxes.propTypes = {
  item: PropTypes.object,
  initial: PropTypes.bool,
  updateConditions: PropTypes.func,
  path: PropTypes.array,
  index: PropTypes.number,
  updateOperatorByPath: PropTypes.func,
  deleteByPath: PropTypes.func
};

export default ConditionsCheckBoxes;
