import React from "react";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Heading from "grommet/components/Heading";

import DocumentTitle from "../partials/Title";

class AboutPage extends React.Component {
  render() {
    return (
      <DocumentTitle key="header" title="About">
        <Box
          key="mainBody"
          flex={true}
          pad={{ vertical: "small", horizontal: "medium" }}
        >
          <Box align="center">
            <Box align="center" size="xxlarge">
              <Box margin={{ vertical: "medium" }}>
                <Heading tag="h2">What is it?</Heading>
                <Paragraph style={{ lineHeight: "180%" }}>
                  CERN Analysis Preservation (CAP) is an open source
                  preservation service developed by the Scientific Information
                  Service at CERN for physicists to preserve and document the
                  various materials produced in the analysis process, e.g.
                  datasets, code, documentation, so that they are reusable and
                  understandable in the future. By using this tool, researchers
                  ensure these outputs are preserved and also findable and
                  accessible by their (internal) collaborators.
                </Paragraph>
                <Paragraph style={{ lineHeight: "180%" }}>
                  To make the tool as easy to use as possible, an API and a
                  dedicated client are available, as well as integrations with
                  long-established collaboration databases and platforms. This
                  reduces the burden on the users and minimises duplication of
                  information. The researchers remain in full control of their
                  information, while being able to preserve and share their data
                  and materials easily with their colleagues and reviewers.
                </Paragraph>
                <Paragraph style={{ lineHeight: "180%" }}>
                  Please refer to our full documentation for more details on how
                  to use CAP, use cases, frequently asked questions and more at{" "}
                  <a href="https://analysispreservation.cern.ch/docs/general/">
                    analysispreservation.cern.ch/docs/general/
                  </a>.
                </Paragraph>
                <Heading tag="h2">How can I use the service?</Heading>
                <Box
                  style={{
                    lineHeight: "180%",
                    margin: "24px 0",
                    fontSize: "16px",
                    fontWeight: 300,
                    maxWidth: "576px",
                    color: "#666"
                  }}
                >
                  It is possible to interact with the service in three different
                  ways: <br />
                  <ul>
                    <li>The submission forms via the user interface</li>
                    <li>
                      The command-line client (<a href="https://analysispreservation.cern.ch/docs/cli/">
                        cap-client
                      </a>)
                    </li>
                    <li>
                      The REST API (<a href="https://analysispreservation.cern.ch/docs/api/">
                        API docs
                      </a>)
                    </li>
                  </ul>
                </Box>
                <Heading tag="h2">Who has access to my work?</Heading>
                <Box
                  style={{
                    lineHeight: "180%",
                    margin: "24px 0",
                    fontSize: "16px",
                    fontWeight: 300,
                    maxWidth: "576px",
                    color: "#666"
                  }}
                >
                  As we are preserving sensitive data, we apply safety measures
                  and access control to all information added to CAP. Access
                  will always be restricted to members of the collaboration
                  associated with an analysis. Permissions within a
                  collaboration can be adjusted by the creator of the analysis,
                  defaulting to creator-only access. More specifically: <br />
                  <ul>
                    <li>
                      only collaboration members have access to a
                      collaboration’s area, can create analyses and can see
                      shared analyses{" "}
                    </li>
                    <li>
                      only a certain collaboration’s members have access to this
                      collaboration’s analyses{" "}
                    </li>
                    <li>
                      only members granted specific rights can see or edit a
                      draft version of an analysis{" "}
                    </li>
                    <li>
                      only the creator can see or edit an analysis with default
                      permission settings For more detailed information please
                      refer to our &nbsp;
                      <a href="https://analysispreservation.cern.ch/docs/general/access.html">
                        documentation
                      </a>.{" "}
                    </li>
                  </ul>
                </Box>
                <Heading tag="h2">Contact</Heading>
                <Paragraph style={{ lineHeight: "180%" }}>
                  You can contact us by opening tickets for requests and
                  incidents through the &nbsp;
                  <a href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation">
                    CERN Service Portal
                  </a>. We welcome everyone to test and use the system. If you
                  or your team/working group/collaboration would like to start
                  using CAP, please get in touch.
                </Paragraph>
              </Box>
            </Box>
          </Box>
        </Box>
      </DocumentTitle>
    );
  }
}

AboutPage.propTypes = {};

export default AboutPage;
