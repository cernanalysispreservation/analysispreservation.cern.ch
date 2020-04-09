import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";

class WelcomePage extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box
          flex={true}
          justify="center"
          colorIndex="neutral-1"
          pad="large"
          responsive={true}
        >
          <Box flex={true} justify="center" align="center" pad="medium">
            <Heading tag="h1">Discover the platform</Heading>
          </Box>
          <Box flex={true} align="center" justify="center" pad="medium">
            <Box size={{ width: "xxlarge" }} align="center">
              <Paragraph size="large">
                CERN Analysis Preservation (CAP) is a service for researchers to
                preserve and document the various components of their physics
                analyses, e.g. datasets, software, documentation, so that they
                are reusable and understandable in the future. By using this
                tool, researchers ensure these outputs are preserved, findable
                and accessible by their collaborators for the long-term.
              </Paragraph>
              <Paragraph size="large">
                CAP uses existing collaboration tools and a flexible data model,
                and it is designed to be easily integrated into researchers'
                workflows. CAP provides standard collaboration access
                restrictions so that the individual users and collaborations are
                in full control of sharing their results.
              </Paragraph>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

WelcomePage.propTypes = {};

export default WelcomePage;
