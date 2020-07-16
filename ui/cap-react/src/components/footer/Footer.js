import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Anchor from "grommet/components/Anchor";

class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer size="small" justify="center" colorIndex="neutral-1-a">
        <Box
          direction="row"
          align="center"
          justify="center"
          pad={{ between: "medium" }}
          className="footer-order"
        >
          <Paragraph margin="none" size="small">
            Copyright {new Date().getFullYear()} © CERN. Created & Hosted by
            CERN. Powered by Invenio Software.
          </Paragraph>
          <Box direction="row" responsive={false} className="footer-items">
            <Box margin={{ horizontal: "small" }}>
              <Anchor label="About" path="/about" />
            </Box>
            <Box margin={{ horizontal: "small" }}>
              <Anchor label="Policy" path="/policy" />
            </Box>
            <Box margin={{ horizontal: "small" }}>
              <Anchor label="Status" path="/status" />
            </Box>
            <Box margin={{ horizontal: "small" }}>
              <Anchor
                label="Contact"
                href="mailto:analysis-preservation-support@cern.ch"
              />
            </Box>
            <Box margin={{ horizontal: "small" }}>
              <Anchor
                target="_blank"
                label="Documentation"
                path="/docs/general/"
              />
            </Box>
          </Box>
        </Box>
      </Footer>
    );
  }
}

export default GrommetFooter;
