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
                CERN Analysis Preservation (CAP) is a service for physicists to
                preserve and document the various materials produced in the
                process of their analyses, e.g. datasets, code, documentation,
                so that they are reusable and understandable in the future. By
                using this tool, researchers ensure these outputs are preserved
                and also findable and accessible by their (internal)
                collaborators.
              </Paragraph>
              <Paragraph size="large">
                CAP provides an integrated platform that allows researchers to
                preserve and document the various materials produced in the
                process of their research and experimentation (datasets, code,
                documentation) so that they are reusable and understandable in
                the future. By using this tool, researchers ensure these outputs
                are preserved, findable and accessible by their collaborators.
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
