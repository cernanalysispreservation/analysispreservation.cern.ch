import React from "react";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import Paragraph from "grommet/components/Paragraph";

import LinkIcon from "grommet/components/icons/base/Link";
import ApiIcon from "./img/api.svg";
import CultureIcon from "./img/cultures.svg";
import TerminalIcon from "./img/terminal.svg";

class Documentation extends React.Component {
  render() {
    return (
      <span ref={this.props.scrollToRef}>
        <Box
          colorIndex="neutral-1"
          style={{}}
          pad="medium"
          align="center"
          justify="center"
        >
          <Box colorIndex="neutral-1" align="center" margin="large">
            <Heading>Documentation</Heading>
          </Box>
          <Box
            margin={{ top: "large", bottom: "large" }}
            direction="row"
            flex
            justify="between"
            pad={{ vertical: "medium" }}
            size={{ width: "xxlarge" }}
            responsive={false}
          >
            <Box>
              <Box
                flex={false}
                size={{ width: "small", height: "medium" }}
                justify="between"
                colorIndex="neutral-1"
                align="center"
              >
                <Box margin={{ bottom: "medium" }}>
                  <CultureIcon height="50px" />
                </Box>
                <Heading tag="h2">User Guide</Heading>
                <Paragraph align="center">
                  Find out how you can use the CAP service to capture, preserve
                  and reuse your analysis through user guides and stories.
                </Paragraph>
                <Anchor
                  href="https://cernanalysispreservation.readthedocs.io/en/latest/project.html"
                  target="_blank"
                >
                  <Box pad="small" colorIndex="neutral-1-a" separator="all">
                    <Label margin="none">
                      General Docs <LinkIcon size="xsmall" />
                    </Label>
                  </Box>
                </Anchor>
              </Box>
            </Box>
            <Box>
              <Box
                align="center"
                flex={false}
                size={{ width: "small", height: "medium" }}
                justify="between"
                margin={{ horizontal: "medium" }}
              >
                <Box margin={{ bottom: "medium" }}>
                  <TerminalIcon height="50px" />
                </Box>
                <Heading tag="h2">CLI Client</Heading>
                <Paragraph align="center">
                  Learn how to interact with your analysis workspace via the
                  command line interface, to make the preservation process part
                  of your everyday work.
                </Paragraph>
                <Anchor
                  href="https://cap-client.readthedocs.io/en/latest/?badge=latest#"
                  target="_blank"
                >
                  <Box pad="small" colorIndex="neutral-1-a" separator="all">
                    <Label margin="none">
                      CAP-client Guide <LinkIcon size="xsmall" />
                    </Label>
                  </Box>
                </Anchor>
              </Box>
            </Box>
            <Box>
              <Box
                align="center"
                flex={false}
                size={{ width: "small", height: "medium" }}
                justify="between"
              >
                <Box margin={{ bottom: "medium" }}>
                  <ApiIcon height="50px" />
                </Box>
                <Heading tag="h2">RESTful API</Heading>
                <Paragraph align="center">
                  Try using our RESTful interface, to integrate CAP with your
                  daily tools and services using HTTP requests.
                </Paragraph>
                <Anchor
                  href="https://cernanalysispreservation.readthedocs.io/en/latest/api.html"
                  target="_blank"
                >
                  <Box pad="small" colorIndex="neutral-1-a" separator="all">
                    <Label margin="none">
                      API Guides & Docs <LinkIcon size="xsmall" />
                    </Label>
                  </Box>
                </Anchor>
              </Box>
            </Box>
          </Box>
        </Box>
      </span>
    );
  }
}

Documentation.propTypes = {};

export default Documentation;
