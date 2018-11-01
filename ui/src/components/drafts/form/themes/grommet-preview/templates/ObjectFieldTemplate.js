import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import LayerObjectFieldTemplate from "./LayerObjectFieldTemplate";
import FieldHeader from "../components/FieldHeader";

let ObjectFieldTemplate = function(props) {
  if (props.idSchema.$id == "root") {
    return <Box>{props.properties.map(prop => prop.content)}</Box>;
  }

  if (!("ui:object" in props.uiSchema)) {
    return (
      <Box margin="none" pad="none">
        {props.title ? (
          <FieldHeader
            title={props.title}
            required={props.required}
            description={props.description ? props.description : null}
          />
        ) : null}
        {props.properties.map(prop => prop.content)}
      </Box>
    );
  } else {
    if (props.uiSchema["ui:object"] == "layerObjectField") {
      return <LayerObjectFieldTemplate {...props} />;
    } else if (props.uiSchema["ui:object"] == "accordionObjectField") {
      // return <AccordionFieldTemplate {...props} />;
      return (
        <Box margin="none" pad="none">
          {props.title ? (
            <FieldHeader
              title={props.title}
              required={props.required}
              description={props.description ? props.description : null}
            />
          ) : null}
          {props.properties.map(prop => prop.content)}
        </Box>
      );
    } else {
      return (
        <div {...props}>
          This object( <i>{props.title}</i>) can NOT be rendered.. Check
          implementaion
        </div>
      );
    }
  }
};

ObjectFieldTemplate.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.array
};

export default ObjectFieldTemplate;
