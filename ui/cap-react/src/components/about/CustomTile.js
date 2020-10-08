import React from 'react';
import Tile from 'grommet/components/Tile';
import Heading from 'grommet/components/Heading';
import PropTypes from 'prop-types';

const CustomTile = props => {
  return (
    <Tile basis={props.basis || '1/2'} pad="large">
      <Heading tag="h5">{props.header}</Heading>
      <code style={{ color: '#C094bf' }}>
        <span>{props.code}</span>
      </code>
    </Tile>
  );
};

CustomTile.propTypes = {
  basis: PropTypes.string,
  header: PropTypes.node,
  code: PropTypes.string
};

export default CustomTile;
