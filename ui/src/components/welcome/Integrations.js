import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

import Paragraph from "grommet/components/Paragraph";

import { ReanaIcon } from "../drafts/form/themes/grommet/fields/components/ReanaIcon";

import GitImage from "./img/github_gitlab.svg";
import PIDFair from "./img/pid_fair.svg";

class Integrations extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box margin={{ bottom: "large" }}>
          <Box align="center" pad="large">
            <Heading>Integrations</Heading>
          </Box>
          <Box flex={false}>
            <Box
              responsive={false}
              direction="row"
              flex={false}
              justify="center"
              align="center"
              pad="medium"
            >
              <Box
                size={{ width: "xxlarge" }}
                direction="row"
                justify="between"
              >
                <Box pad="small">
                  <Heading tag="h2">Source Code</Heading>
                  <Paragraph size="large">
                    Attach code to your workspace. Connect your Github and CERN
                    Gitlab accounts, follow repository changes and automatically
                    keep snapshots of your work and the tools/libraries you use
                  </Paragraph>
                </Box>
                <Box
                  direction="row"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <GitImage height="100px" />
                </Box>
              </Box>
            </Box>
            <Box
              flex={false}
              direction="row"
              align="center"
              justify="center"
              pad="medium"
              responsive={false}
              colorIndex="light-2"
            >
              <Box
                size={{ width: "xxlarge" }}
                direction="row"
                justify="between"
              >
                <Box align="center" pad="small" justify="center">
                  <PIDFair height="110px" />
                </Box>
                <Box align="end" pad="small">
                  <Heading tag="h2">PIDs/FAIR data</Heading>
                  <Paragraph align="end" size="large">
                    Preserve everything with a <strong>FAIR</strong> manner (<strong
                    >
                      F
                    </strong>indable <strong>A</strong>ccesible{" "}
                    <strong>I</strong>nteroperable <strong>R</strong>eusable).
                    Make your work citable and ready to be integrated to the
                    global PID “graph”, by connecting together scientific
                    research components on a persistent way.
                  </Paragraph>
                </Box>
              </Box>
            </Box>
            <Box
              flex={false}
              direction="row"
              align="center"
              justify="center"
              responsive={false}
              pad="medium"
            >
              <Box
                size={{ width: "xxlarge" }}
                direction="row"
                justify="between"
              >
                <Box pad="small">
                  <Heading tag="h2">Workflows</Heading>
                  <Paragraph size="large">
                    Make your research <strong>reusable</strong> and{" "}
                    <strong>reproducible</strong>. Create or connect your
                    containerized computational workflows, attach the output
                    results and make your work more transparent
                  </Paragraph>
                </Box>
                <Box
                  direction="row"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <ReanaIcon size="xlarge" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

Integrations.propTypes = {};

export default Integrations;
