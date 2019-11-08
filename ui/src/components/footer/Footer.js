import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";

class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer size="small" justify="center" colorIndex="neutral-1" pad="small">
        <Box
          direction="row"
          align="center"
          justify="center"
          pad={{ between: "medium" }}
        >
          <Paragraph margin="none">
            Copyright 2018 © CERN. Created & Hosted by CERN. Powered by Invenio
            Software.
          </Paragraph>
          <Box
            direction="row"
            responsive={false}
            size="small"
            justify="between"
          >
            <Anchor
              label="Contact"
              href="mailto:analysis-preservation-support@cern.ch"
            />
            <Anchor label="About" path="/about" />
            <Anchor label="Status" path="/status" />
          </Box>
        </Box>
      </Footer>
    );
  }
}

export default GrommetFooter;
