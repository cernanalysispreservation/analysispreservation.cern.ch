import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';

class AboutPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Box flex={true} colorIndex="neutral-1-a" justify="center" align="center">
          <Section>
            <Box size="large">
              <Heading tag="h2">About Page</Heading>
            </Box>
          </Section>
        </Box>
      </Box>
    );
  }
}

AboutPage.propTypes = {
};

export default AboutPage;
