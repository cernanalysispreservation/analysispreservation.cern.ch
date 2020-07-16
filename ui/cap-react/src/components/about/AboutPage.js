import React from "react";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Heading from "grommet/components/Heading";
import Header from "../partials/Header";
import GrommetFooter from "../footer/Footer";

class AboutPage extends React.Component {
  render() {
    return [
      <Header key="header" />,
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
                CERN Analysis Preservation (CAP) is a service for physicists to
                preserve and document the various materials produced in the
                process of their analyses, e.g. datasets, code, documentation,
                so that they are reusable and understandable in the future. By
                using this tool, researchers ensure these outputs are preserved
                and also findable and accessible by their (internal)
                collaborators.
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                To make the tool as easy to use as possible, an API and a
                dedicated client are available, as well as integrations with
                existing databases and platforms used by the collaborations.
                This shall help reducing the burden on the HEP researchers and
                to avoid duplication of information. The researchers remain in
                full control of their datasets while being able to preserve and
                share their data and materials easily with their colleagues.
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                CAP is now in Beta phase. We welcome everyone to test and use
                the system. For more details about how to use CAP, the
                documentation for the service can be found at{" "}
                <a href="https://cernanalysispreservation.readthedocs.io/en/latest/">
                  cernanalysispreservation.readthedocs.io/en/latest/
                </a>{" "}
                and the documentation for the CAP client at{" "}
                <a href="https://cap-client-test.readthedocs.io/en/latest">
                  cap-client-test.readthedocs.io/en/latest
                </a>.
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                The CERN Analysis Preservation Framework includes another
                component, the Reusable Analyses service,{" "}
                <a href="http://www.reana.io/">REANA</a>, which is a platform
                for reusable research data analyses. Another related service is
                the <a href="http://opendata.cern.ch/">CERN Open Data portal</a>,
                which can be used to publish openly various materials, such as
                datasets, software, configuration files, etc. These services are
                being developed and operated by the CERN IT and the Scientific
                Information Service.
              </Paragraph>
              <Heading tag="h2">What can I submit?</Heading>
              <Paragraph style={{ lineHeight: "180%" }}>
                There are 10 gigabytes of storage available to submit your
                n-tuples and output macros (for each of your individual
                analyses).
              </Paragraph>
              <Heading tag="h2">How can I submit?</Heading>
              <Paragraph style={{ lineHeight: "180%" }}>
                It is possible to interact with the service in three different
                ways: <br />
                <ul>
                  <li>The submission forms via the user interface</li>
                  <li>
                    The command-line client (<a href="https://cap-client.readthedocs.io/en/latest/?badge=latest#">
                      cap-client
                    </a>)
                  </li>
                  <li>
                    The REST API (<a href="https://cernanalysispreservation.readthedocs.io/en/latest/api.html">
                      API docs
                    </a>)
                  </li>
                </ul>
              </Paragraph>
              <Heading tag="h2">Who has access to my work?</Heading>
              <Paragraph style={{ lineHeight: "180%" }}>
                As we are preserving sensitive data, we apply safety measures
                and access control to all information added to CAP. Access will
                always be restricted to members of the collaboration associated
                with an analysis. Permissions within a collaboration can be
                adjusted by the creator of the analysis, defaulting to
                creator-only access. More specifically: <br />
                <ul>
                  <li>
                    only collaboration members have access to a collaboration’s
                    area, can create analyses and can see shared analyses{" "}
                  </li>
                  <li>
                    only a certain collaboration’s members have access to this
                    collaboration’s analyses{" "}
                  </li>
                  <li>
                    only members granted specific rights can see or edit a draft
                    version of an analysis{" "}
                  </li>
                  <li>
                    only the creator can see or edit an analysis with default
                    permission settings For more detailed information please
                    refer to our &nbsp;
                    <a href="https://cernanalysispreservation.readthedocs.io/en/latest/project.html#project-access">
                      documentation
                    </a>.{" "}
                  </li>
                </ul>
              </Paragraph>
              <Heading tag="h2">Contact</Heading>
              <Paragraph style={{ lineHeight: "180%" }}>
                Get in touch with us! Send us a message at&nbsp;
                <a href="mailto:analysis-preservation-support@cern.ch">
                  analysis-preservation-support@cern.ch
                </a>
              </Paragraph>
            </Box>
          </Box>
        </Box>
      </Box>,
      <GrommetFooter key="footer" />
    ];
  }
}

AboutPage.propTypes = {};

export default AboutPage;
