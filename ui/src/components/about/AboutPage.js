import React from 'react';

import Box from 'grommet/components/Box';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import Heading from 'grommet/components/Heading';
import Header from '../partials/Header';

class AboutPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Header />
        <Box flex={true} colorIndex="neutral-1-a" justify="center" align="center">
          <Section>
            <Box size="large">
              <Heading tag="h2">CERN Analysis Preservation</Heading>
              <Paragraph>
                CERN Analysis Preservation is a service for physicists to preserve and document
                the various materials produced in the process of their analyses, e.g. datasets,
                code, documentation, so that they are reusable and understandable in the future.
                By using this tool, researchers ensure these outputs are preserved and also findable
                and accessible by their (internal) collaborators.
              </Paragraph>
              <Paragraph>
                To make the tool as easy to use as possible, an API and a dedicated client are available,
                as well as integrations with existing databases and platforms used by the collaborations.
                This shall help reducing the burden on the HEP researchers and to avoid duplication of information.
                The researchers remain in full control of their datasets while being able to preserve and share their
                data and materials easily with their colleagues. A search engine allows collaborators to search for
                elements of an analysis, such as trigger information or selection criteria.
              </Paragraph>
              <Paragraph>
                CERN Analysis Preservation serves the High-Energy Physics community and corresponds
                to current data management policies which have been put into place by funding agencies
                in recent years. These policies demand data management that facilitates future reuse and
                reproducibility of research outcomes. CERN Analysis Preservation and
                <a style={{"textDecoration": "underline"}} href="http://opendata.cern.ch/" target="_blank"> CERN Open Data</a> enable
                researchers to comply with these requirements, while offering functionalities to simplify
                internal research workflows and publishing procedures. CAP enables the user to give specific
                access to analysis records and store relevant analysis information in one place, so that
                reviewing analyses and the process of analysis approval becomes easier. CERN Open Data can be
                used to publish openly various materials, such as datasets, software, configuration files, etc.
              </Paragraph>
              <Paragraph>
                The CERN Analysis Preservation Framework includes another component, the <a href="http://www.reana.io/" target="_blank">Reusable Analyses</a> - REANA - service.
                REANA is a platform for reusable research data analyses. It permits researchers to structure their analysis data,
                code, environment and workflows in a reusable manner. It  allows the users to instantiate and run computational
                research data analysis workflows on remote containerised compute clouds.
              </Paragraph>
              <Paragraph>
                These services are being developed and operated by the CERN IT and the Scientific Information Service.
              </Paragraph>
              <Paragraph>
                The documentation for the service can be found at
                <a style={{"textDecoration": "underline"}} href="https://cernanalysispreservation.readthedocs.io/en/latest/index.html" target="_blank">
                cernanalysispreservation.readthedocs.io/en/latest/</a>
                and the documentation for the CAP client at
                <a style={{"textDecoration": "underline"}} href="http://cap-client-test.readthedocs.io/en/latest" target="_blank">
                cap-client-test.readthedocs.io/en/latest</a>.
              </Paragraph>
              <Paragraph>
                Questions can be addressed to <a style={{"textDecoration": "underline"}} href="mailto:analysis-preservation-support@cern.ch">
                analysis-preservation-support@cern.ch</a>
              </Paragraph>
            </Box>
          </Section>
        </Box>
      </Box>
    );
  }
}

export default AboutPage;
