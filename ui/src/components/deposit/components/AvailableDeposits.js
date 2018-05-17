import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Heading,
  Tiles,
  Tile,
  Paragraph
} from 'grommet';

const AvailableDeposits = (props) => {
  const {schemas, selectSchema} = props;
  
  return (
    <Box flex={true} justify="center">
      <Heading align="center" tag="h6">Choose a schema to start</Heading>
      <Tiles flush={false} fill={false} size="large" justify="center">
        {
          Object.keys(schemas).map((schema) => (
            <Tile key={schema} size="small" pad="small" colorIndex="light-2" onClick={selectSchema.bind(this, schema)}>
              <Paragraph align="center">{schemas[schema]}</Paragraph>
            </Tile>
          ))
        }
      </Tiles>
    </Box>
  );
};

AvailableDeposits.propTypes = {
  schemas: PropTypes.object,
  selectSchema: PropTypes.func
};

export default AvailableDeposits;