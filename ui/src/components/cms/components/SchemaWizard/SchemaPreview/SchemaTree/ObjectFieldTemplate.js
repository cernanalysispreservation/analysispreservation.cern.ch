import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

const ObjectFieldTemplate = props => {
  if (props.idSchema.$id == "root") {
    return <Box>{props.properties.map(prop => prop.content)}</Box>;
  }
};

ObjectFieldTemplate.propTypes = {
  idSchema: PropTypes.object,
  properties: PropTypes.array
};

export default ObjectFieldTemplate;
