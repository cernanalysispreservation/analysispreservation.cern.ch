import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";

import Database from "grommet/components/icons/base/Database";
import Refresh from "grommet/components/icons/base/Refresh";
import Group from "grommet/components/icons/base/Group";

import HomeImage from "./img/home-image.svg";
import "../../styles/styles.scss";

class WelcomePage extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box flex={true} pad={{ horizontal: "xlarge" }}>
          <Box
            flex={false}
            responsive={true}
            pad={{ vertical: "large", between: "medium" }}
            margin={{ top: "medium", bottom: "large" }}
            justify="center"
            direction="row"
          >
            <Box
              flex={true}
              pad={{ between: "large" }}
              wrap={true}
              direction="row"
              size="medium"
              justify="center"
              justify="center"
            >
              <Box
                flex={true}
                size={{ width: { min: "medium", max: "large" } }}
                margin="large"
                justify="center"
                justify="center"
              >
                <Heading strong>CERN Analysis Preservation</Heading>
                <Heading tag="h2">
                  Our mission is to preserve physics analyses to facilitate
                  their future reuse
                </Heading>
              </Box>
              <Box
                size={{ width: { min: "medium", max: "large" } }}
                flex={true}
                margin="large"
                justify="center"
              >
                <HomeImage />
              </Box>
            </Box>
          </Box>
          <Box flex margin="large" justify="center" align="center">
            <Box
              direction="row"
              align="center"
              justify="center"
              pad={{ between: "large" }}
              responsive={true}
              flex={true}
              wrap={true}
              margin={{ bottom: "medium" }}
            >
              <Box align="center" flex={false}>
                <Heading tag="h2">Capture</Heading>
                <Database size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Collect elements needed to understand and rerun the analysis
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center" flex={false}>
                <Heading tag="h2">Collaborate</Heading>
                <Group size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Share analysis and components with users and your
                    collaboration
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center" flex={false}>
                <Heading tag="h2">Reuse</Heading>
                <Refresh size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Run containerized workflows and easily reuse analysis
                    elementys
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

WelcomePage.propTypes = {};

export default WelcomePage;
