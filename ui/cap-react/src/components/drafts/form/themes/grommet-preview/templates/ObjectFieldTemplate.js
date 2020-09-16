import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";
import Heading from "grommet/components/Heading";
import TabField from "../../grommet/templates/TabField";

let ObjectFieldTemplate = function(props) {
  const { properties, title, uiSchema, idSchema, formData } = props;

  if ("ui:object" in uiSchema && uiSchema["ui:object"] === "tabView") {
    return <TabField {...props} />;
  }

  function allPropsEmpty(obj) {
    for (let key in obj) if (obj[key] !== undefined) return false;
    return true;
  }

  if (allPropsEmpty(formData)) return null;

  if (idSchema.$id == "root") {
    return <Box flex={true}>{properties.map(prop => prop.content)}</Box>;
  }

  if (!("ui:object" in uiSchema)) {
    return (
      <Box flex={true} colorIndex="light-2" margin={{ bottom: "small" }}>
  
        <Box margnin={{ left: "small" }}>
          {properties.map(prop => prop.content)}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box flex={true}>
      
        {properties.map(prop => prop.content)}
      </Box>
    );
  }
};

ObjectFieldTemplate.propTypes = {
  title: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.array,
  formData: PropTypes.object
};

export default ObjectFieldTemplate;
