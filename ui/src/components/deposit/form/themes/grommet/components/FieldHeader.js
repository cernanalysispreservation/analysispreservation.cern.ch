import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Heading,
  Paragraph,
  Button
} from 'grommet';

import AddIcon from 'grommet/components/icons/base/Add';

let FieldHeader = function (props) {
  const {title, required, description} = props;
  return (
    <Box flex={true} margin={props.margin ? props.margin : {vertical: "small"}}>
          <Box direction="row" align="center" justify="between">
          <Box>
      <Heading tag="h4" margin="none" strong={false}>
        {title}{required ? "*" : null}
      </Heading>
      </Box>
        {
          props.onArrayAddClick ?
          <Box>
            <Button
              icon={<AddIcon />}
              onClick={props.onArrayAddClick}
              href="#"
              plain={false}
              critical={false}
              primary={false}/>
          </Box> : null
        }
      </Box>
      {description ? <Paragraph margin="none" size="small">{description}</Paragraph> : null}
    </Box>
  );
};

FieldHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  margin: PropTypes.string,
  onArrayAddClick: PropTypes.func,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
};

export default FieldHeader;