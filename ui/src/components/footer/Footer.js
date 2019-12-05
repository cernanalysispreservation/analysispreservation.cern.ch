import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Menu from "grommet/components/Menu";
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
        >
          <Paragraph margin="none">
            Copyright {new Date().getFullYear()} © CERN. Created & Hosted by
            CERN. Powered by Invenio Software.
          </Paragraph>
          <Menu direction="row" size="small" dropAlign={{ right: "right" }}>
            <Anchor
              label="Contact"
              href="mailto:analysis-preservation-support@cern.ch"
            />
            <Anchor label="About" path="/about" />
            <Anchor label="Status" path="/status" />
          </Menu>
        </Box>
      </Footer>
    );
  }
}

export default GrommetFooter;
