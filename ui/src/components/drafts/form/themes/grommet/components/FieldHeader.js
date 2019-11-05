import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import Button from "grommet/components/Button";

import AddIcon from "grommet/components/icons/base/Add";

let FieldHeader = function(props) {
  const { title, required, description, readonly } = props;
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
            {readonly ? null : (
              <Button
                icon={<AddIcon />}
                onClick={props.onArrayAddClick}
                href="#"
                plain={false}
                critical={false}
                primary={false}
              />
            )}
          </Box>
        ) : null}
      </Box>
      {description ? (
        <Paragraph margin="none" size="small">
          {description}
        </Paragraph>
      ) : null}
    </Box>
  );
};

FieldHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  margin: PropTypes.string,
  onArrayAddClick: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  readonly: PropTypes.bool
};

export default FieldHeader;
