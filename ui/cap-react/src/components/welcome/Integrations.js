import React from "react";
import PropTypes from "prop-types";
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
        <Box pad={{ horizontal: "large", between: "large", vertical: "large" }}>
          <Box flex={true} justify="center" align="center" pad="medium">
            <Heading tag="h1">Integrations</Heading>
          </Box>
          <Box margin={{ bottom: "medium" }} flex={false}>
            <Box
              responsive={false}
              direction="row"
              flex={false}
              justify="center"
              align="center"
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
                    keep snapshots of your work and of the tools/libraries you
                    use.
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
                  <PIDFair />
                </Box>
                <Box align="end" pad="small">
                  <Heading tag="h2">Persistent Identifiers/FAIR data</Heading>
                  <Paragraph align="end" size="large">
                    Preserve your analysis in a <strong>FAIR</strong> manner (<strong
                    >
                      F
                    </strong>indable <strong>A</strong>ccesible{" "}
                    <strong>I</strong>nteroperable <strong>R</strong>eusable).
                    Use persistent identifiers (PIDs) to capture and connect
                    your analysis components. Make your work citable by pushing
                    it to external services that provide PIDs.
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
                    <strong>reproducible</strong>. Create your containerized
                    workflows, rerun whenever you want and save your results.
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

Integrations.propTypes = {
  scrollToRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default Integrations;
