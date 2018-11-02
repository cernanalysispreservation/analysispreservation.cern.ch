import React from "react";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import Heading from "grommet/components/Heading";
import Header from "../partials/Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Header as BlueHeader } from "grommet";
import GrommetFooter from "../footer/Footer";

class AboutPage extends React.Component {
  render() {
    return [
      this.props.isLoggedIn ? (
        [
          <Header />,
          <BlueHeader
            size="small"
            colorIndex="neutral-1-a"
            pad="none"
            wrap={true}
            justify="center"
          />
        ]
      ) : (
        <Box
          align="center"
          full="horizontal"
          pad="medium"
          colorIndex="neutral-1-a"
        />
      ),
      <Box flex={true} full={true} margin="small">
        <Box align="center">
          <Box align="center" size="xxlarge">
            <Box>
              <Heading tag="h2">What is it?</Heading>
              <Paragraph>
                CERN Analysis Preservation (CAP) is a service for physicists to
                preserve and document the various materials produced in the
                process of their analyses, e.g. datasets, code, documentation,
                so that they are reusable and understandable in the future. By
                using this tool, researchers ensure these outputs are preserved
                and also findable and accessible by their (internal)
                collaborators.
              </Paragraph>
              <Paragraph>
                To make the tool as easy to use as possible, an API and a
                dedicated client are available, as well as integrations with
                existing databases and platforms used by the collaborations.
                This shall help reducing the burden on the HEP researchers and
                to avoid duplication of information. The researchers remain in
                full control of their datasets while being able to preserve and
                share their data and materials easily with their colleagues.
              </Paragraph>
              <Paragraph>
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
              <Paragraph>
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
              <Paragraph>
                There are 10 gigabytes of storage available to submit your
                n-tuples and output macros (for each of your individual
                analyses).
              </Paragraph>
              <Heading tag="h2">How can I submit?</Heading>
              <Paragraph>
                It is possible to interact with the service in three different
                ways: <br />
                * The submission forms via the user interface <br />
                * The command-line client (<a href="https://cap-client.readthedocs.io/en/latest/?badge=latest#">
                  cap-client
                </a>) <br />
                * The REST API (<a href="https://cernanalysispreservation.readthedocs.io/en/latest/api.html">
                  API docs
                </a>)
              </Paragraph>
              <Heading tag="h2">Who has access to my work?</Heading>
              <Paragraph>
                As we are preserving sensitive data, we apply safety measures
                and access control to all information added to CAP. Access will
                always be restricted to members of the collaboration associated
                with an analysis. Permissions within a collaboration can be
                adjusted by the creator of the analysis, defaulting to
                creator-only access. More specifically: only collaboration
                members have access to a collaboration’s area, can create
                analyses and can see shared analyses only a certain
                collaboration’s members have access to this collaboration’s
                analyses only members granted specific rights can see or edit a
                draft version of an analysis only the creator can see or edit an
                analysis with default permission settings For more detailed
                information please refer to our{" "}
                <a href="https://cernanalysispreservation.readthedocs.io/en/latest/project.html#project-access">
                  documentation
                </a>.
              </Paragraph>
              <Heading tag="h2">Contact</Heading>
              <Paragraph>
                Get in touch with us! Send us a message at:{" "}
                <a href="mailto:analysis-preservation-support@cern.ch">
                  analysis-preservation-support@cern.ch
                </a>
              </Paragraph>
            </Box>
          </Box>
        </Box>
      </Box>,
      this.props.isLoggedIn ? <GrommetFooter /> : null
    ];
  }
}

AboutPage.propTypes = {
  isLoggedIn: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.getIn(["isLoggedIn"])
  };
}

export default connect(
  mapStateToProps,
  {}
)(AboutPage);
