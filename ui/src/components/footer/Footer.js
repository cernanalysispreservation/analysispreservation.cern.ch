import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";

import capPackageJSON from "../../../package";

class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer colorIndex="neutral-1">
        <Box flex={true}>
          <Box
            direction="row"
            align="center"
            justify="center"
            pad={{ between: "medium" }}
          >
            <Paragraph margin="none">
              Copyright 2018 © CERN. Created & Hosted by CERN. Powered by
              Invenio Software.
            </Paragraph>
            <Menu direction="row" size="small" dropAlign={{ right: "right" }}>
              <Anchor
                label="Contact"
                href="mailto:analysis-preservation-support@cern.ch"
              />
              <Anchor label="About" path="/about" />
            </Menu>
          </Box>
        </Box>
        <div style={styles.version}>ver. {capPackageJSON.version}</div>
      </Footer>
    );
  }
}

const styles = {
  version: {
    padding: "0 10px",
    fontSize: "11px",
    color: "#ccc",
    justifySelf: "flex-end"
  }
};

export default GrommetFooter;
