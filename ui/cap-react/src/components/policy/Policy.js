import React from "react";
import Header from "../partials/Header";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import GrommetFooter from "../footer/Footer";
import Anchor from "grommet/components/Anchor";

const Policy = () => {
  return (
    <Box flex>
      <Header />
      <Box flex={true} pad={{ vertical: "small", horizontal: "medium" }}>
        <Box align="center">
          <Box align="center" size="xxlarge">
            <Box margin={{ vertical: "medium" }}>
              <Heading tag="h2">Privacy Policy</Heading>
              <Paragraph style={{ lineHeight: "180%" }}>
                CERN does not track, collect or retain personal information from
                users of the CERN Analysis Preservation service, except as
                otherwise provided herein. In order to enhance CERN Analysis
                Preservation and monitor traffic, non-personal information such
                as IP addresses and cookies may be tracked and retained, as well
                as log files shared in aggregation with other community
                services. User provided information, such as metadata, will be
                integrated into the database without displaying its source.
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                CERN Analysis Preservation will take all reasonable measures to
                protect the privacy of its users and to resist service
                interruptions, intentional attacks, or other events that may
                compromise the security of the CERN Analysis Preservation
                website.
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                If you have any questions about the CERN Analysis Preservation
                privacy policy, please{" "}
                <Anchor
                  label="contact"
                  href="mailto:analysis-preservation-support@cern.ch"
                />
              </Paragraph>
              <Paragraph style={{ lineHeight: "180%" }}>
                See also CERN’s{" "}
                <Anchor
                  target="_blank"
                  label="Data Privacy Protection Policy."
                  href="https://home.cern/data-privacy-protection-policy"
                />
              </Paragraph>
            </Box>
          </Box>
        </Box>
      </Box>
      <GrommetFooter key="footer" />
    </Box>
  );
};

Policy.propTypes = {};

export default Policy;
