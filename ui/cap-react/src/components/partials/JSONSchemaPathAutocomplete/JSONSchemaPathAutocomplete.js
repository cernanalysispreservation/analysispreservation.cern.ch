import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const JSONSchemaPathAutocomplete = ({ obj = {} }) => {
  const [currentKeys, setCurrentKeys] = useState(
    Object.entries(obj.properties)
  );
  const [currentObj, setCurrentObj] = useState(obj);
  const [keyPath, setKeyPath] = useState([]);

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
      let nextKey = getKeyByType(currentObj[currentKey][key[0]]);
      setCurrentKeys(Object.entries(currentObj[currentKey][key[0]][nextKey]));
      setCurrentObj(currentObj[currentKey][key[0]]);
    } else {
      setCurrentKeys([]);
      setCurrentObj({});
    }
    setKeyPath(prv => [...prv, key[0]]);
  };

  return (
    <div>
      <pre>{keyPath.join(">")}</pre>
      <Select
        styles={{ width: "200px" }}
        onChange={val => updateKeys(val.value)}
        options={currentKeys.map(item => ({ label: item[0], value: item }))}
        value={{ label: keyPath.join(">"), value: keyPath.join(">") }}
      />
    </div>
  );
};

JSONSchemaPathAutocomplete.propTypes = {};

export default JSONSchemaPathAutocomplete;
