import React from "react";
import PropTypes from "prop-types";
import Tag from "../../../../../../../../partials/Tag";
import Button from "../../../../../../../../partials/Button";
import EditableField from "../../../../../../../../partials/EditableField";
import AutoComplete from "../../../../../../../../partials/JSONSchemaPathAutocomplete";
import { transformSchema } from "../../../../../../../../drafts/DraftEditor";
import { Box } from "grommet";
import { AiOutlineClose } from "react-icons/ai";
import { OPERATIONS } from "./operations";
import Select from "react-select";

const ConditionsCheckBoxes = ({
  item,
  path = [],
  updateConditions,
  index = undefined,
  updateOperatorByPath,
  deleteByPath,
  updateValueByPath,
  schema
}) => {
  if (index) path = [...path, "checks", index];

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
          separator={items.has("op") && items.has("checks") && "all"}
          pad="small"
          style={{ minWidth: "max-content", position: "relative" }}
          margin={{ horizontal: "medium" }}
        >
          <ConditionsCheckBoxes
            op={item.get("op")}
            item={items}
            path={path}
            index={index}
            schema={schema}
            updateConditions={updateConditions}
            updateOperatorByPath={updateOperatorByPath}
            deleteByPath={deleteByPath}
            updateValueByPath={updateValueByPath}
          />
          <Box style={{ position: "absolute", right: -8, top: -8 }}>
            <Button
              icon={<AiOutlineClose />}
              size="iconSmall"
              criticalOutline
              rounded
              onClick={() => deleteByPath(path, items)}
            />
          </Box>
        </Box>
        {index !== item.get("checks").size - 1 && (
          <Box
            onClick={() => updateOperatorByPath(path)}
            style={{ minWidth: "fit-content" }}
          >
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
        {index === item.get("checks").size - 1 && (
          <Box style={{ minWidth: "85px", margin: "0 5px" }}>
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
      <AutoComplete
        obj={transformSchema(schema.toJS())}
        value={item.get("path")}
        updateValue={val => updateValueByPath(path, item, "path", val)}
      />
      <Box align="center" justify="center">
        <Select
          menuPortalTarget={document.querySelector("#conditionCheckBoxes")}
          onChange={val =>
            updateValueByPath(path, item, "condition", val.value)
          }
          options={OPERATIONS}
          value={{ label: item.get("condition"), value: item.get("condition") }}
          styles={{
            menu: () => ({ width: "100px", background: "#fff" }),
            singleValue: () => ({
              width: "50px"
            })
          }}
          placeHolder="Select condition"
        />
      </Box>
      <Box align="center" justify="center">
        <Tag
          text={
            <EditableField
              value={item.get("value")}
              emptyValue="true"
              onUpdate={val => updateValueByPath(path, item, "value", val)}
            />
          }
          size="large"
        />
      </Box>
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
