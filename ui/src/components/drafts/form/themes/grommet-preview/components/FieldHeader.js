import React from "react";
import PropTypes from "prop-types";

import { Box, Heading, Button } from "grommet";

import AddIcon from "grommet/components/icons/base/Add";

let FieldHeader = function(props) {
  const { title, required } = props;
  return (
    <Box margin={props.margin ? props.margin : { vertical: "small" }}>
      <Box direction="row" align="center" justify="between">
        {title ? (
          <Heading tag="h4" margin="none" strong={false}>
            {title}
            {required ? "*" : null}
          </Heading>
        ) : null}
        {props.onArrayAddClick ? (
          <Box>
            <Button
              icon={<AddIcon />}
              onClick={props.onArrayAddClick}
              href="#"
              plain={false}
              critical={false}
              primary={false}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

FieldHeader.propTypes = {
  title: PropTypes.object,
  description: PropTypes.string,
  margin: PropTypes.string,
  onArrayAddClick: PropTypes.func,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object
};

export default FieldHeader;
