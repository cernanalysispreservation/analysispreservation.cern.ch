import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import Button from "../Button";
import { AiOutlineClose } from "react-icons/ai";
import { Box } from "grommet";

const JSONSchemaPathAutocomplete = ({ obj = {}, value, updateValue }) => {
  const [currentKeys, setCurrentKeys] = useState(
    Object.entries(obj.properties)
  );
  const [currentObj, setCurrentObj] = useState(obj.properties);

  const getKeyByType = key => {
    if (key.type) {
      const choices = {
        object: "properties",
        array: "items"
      };
      return choices[key.type];
    }
    // in case the type is missing try to find if there is properties or items key
    if (key.properties) return "properties";
    if (key.items) return "items";

    // in case there is nothing just return undefined
    return undefined;
  };

  const updateKeys = key => {
    let currentKey = getKeyByType(key[1]);
    if (currentKey) {
      let nextKey = getKeyByType(currentObj[key[0]][currentKey]);
      if (nextKey) {
        setCurrentKeys(Object.entries(currentObj[key[0]][currentKey][nextKey]));
        setCurrentObj(currentObj[key[0]][currentKey][nextKey]);
      } else {
        setCurrentKeys(Object.entries(currentObj[key[0]][currentKey]));
        setCurrentObj(currentObj[key[0]][currentKey]);
      }
    } else {
      setCurrentKeys([]);
      setCurrentObj({});
    }
    updateValue(value ? value + "." + key[0] : key[0]);
  };

  return (
    <Box
      direction="row"
      align="center"
      responsive={false}
      separator="all"
      pad={{ horizontal: "small" }}
    >
      <Select
        menuPortalTarget={document.querySelector("#conditionCheckBoxes")}
        onChange={val => updateKeys(val.value)}
        options={currentKeys.map(item => ({ label: item[0], value: item }))}
        value={{ label: value, value: value }}
        styles={{
          menu: () => ({ width: "200px", background: "#fff" }),
          singleValue: () => ({
            width: "150px"
          })
        }}
        placeHolder="Select your path"
      />
      <Button
        icon={<AiOutlineClose />}
        size="iconSmall"
        margin="0 0 0 5px"
        criticalOutline
        rounded
        onClick={() => {
          updateValue(undefined);
          setCurrentObj(obj.properties);
          setCurrentKeys(Object.entries(obj.properties));
        }}
      />
    </Box>
  );
};

JSONSchemaPathAutocomplete.propTypes = {
  obj: PropTypes.object,
  updateValue: PropTypes.func,
  value: PropTypes.string
};

export default JSONSchemaPathAutocomplete;
