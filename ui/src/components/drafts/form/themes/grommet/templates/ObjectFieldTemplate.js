import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import AccordionFieldTemplate from "./AccordionObjectField";
import TabField from "./TabField";
import LayerObjectFieldTemplate from "./LayerObjectFieldTemplate";

import FieldHeader from "../components/FieldHeader";

let ObjectFieldTemplate = function(props) {
  //let { uiSchema: { uiOptions = {} } = {} } = props;

  if (
    props.idSchema.$id == "root" &&
    props.uiSchema["ui:object"] != "tabView"
  ) {
    return (
      <Box
        style={{
          display: "grid",
          justifyContent:
            props.uiSchema["ui:options"] && props.uiSchema["ui:options"].align
              ? props.uiSchema["ui:options"].align
              : "center"
        }}
      >
        <Box
          size={
            props.uiSchema["ui:options"] && props.uiSchema["ui:options"].size
              ? props.uiSchema["ui:options"].size
              : "full"
          }
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridColumnGap: "10px",
              overflow: "auto"
            }}
          >
            {props.properties.map(prop => prop.content)}
          </Box>
        </Box>
      </Box>
    );
  }

  if (!("ui:object" in props.uiSchema)) {
    return (
      <Box pad="none" margin={{ bottom: "small" }}>
        {props.title ? (
          <FieldHeader
            title={props.title}
            required={props.schema.required}
            description={
              props.description ? (
                <span dangerouslySetInnerHTML={{ __html: props.description }} />
              ) : null
            }
          />
        ) : null}

        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gridColumnGap: "1fr",
            maxWidth: "100%"
          }}
        >
          {props.properties.map(prop => prop.content)}
        </Box>
      </Box>
    );
  } else {
    if (props.uiSchema["ui:object"] == "layerObjectField") {
      return <LayerObjectFieldTemplate {...props} />;
    } else if (props.uiSchema["ui:object"] == "accordionObjectField") {
      return <AccordionFieldTemplate {...props} />;
    } else if (props.uiSchema["ui:object"] == "tabView") {
      return <TabField {...props} />;
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
  properties: PropTypes.array,
  schema: PropTypes.object
};

export default ObjectFieldTemplate;
