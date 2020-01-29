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
        <Box
          flex={true}
          pad={{ vertical: "large", horizontal: "xlarge", between: "large" }}
        >
          <Box
            flex={false}
            responsive={true}
            justify="center"
            direction="row"
            pad={{ vertical: "large" }}
          >
            <Box
              flex={true}
              wrap={true}
              direction="row"
              size="medium"
              justify="center"
              pad={{ between: "large" }}
            >
              <Box
                flex={true}
                size={{ width: { min: "medium", max: "large" } }}
                justify="center"
                pad={{ vertical: "large" }}
              >
                <Heading style={{ fontSize: "4.5em" }}>
                  <strong>CERN</strong>
                  <br /> Analysis Preservation
                </Heading>
                <Heading tag="h3">
                  preserve physics analyses to facilitate their future reuse
                </Heading>
              </Box>
              <Box
                size={{ width: { min: "medium", max: "large" } }}
                flex={true}
                justify="center"
              >
                <HomeImage />
              </Box>
            </Box>
          </Box>
          <Box flex justify="center" align="center">
            <Box
              direction="row"
              align="center"
              justify="center"
              responsive={true}
              flex={true}
              wrap={true}
              pad={{ between: "large" }}
            >
              <Box align="center" flex={false}>
                <Heading tag="h3">Capture</Heading>
                <Database size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Collect elements needed to understand and rerun the analysis
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center" flex={false}>
                <Heading tag="h3">Collaborate</Heading>
                <Group size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Share analysis and components with users and your
                    collaboration
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center" flex={false}>
                <Heading tag="h3">Reuse</Heading>
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
