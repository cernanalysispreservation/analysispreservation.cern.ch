import React from "react";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Paragraph from "grommet/components/Paragraph";
import Anchor from "../partials/Anchor";

import capPackageJSON from "../../../package";

class GrommetFooter extends React.Component {
  render() {
    return (
      <Footer
        size="small"
        justify="center"
        colorIndex="neutral-1-a"
        pad={{ horizontal: "small" }}
      >
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

            <div style={styles.version}>ver. {capPackageJSON.version}</div>
          </Box>
        </Box>
      </Footer>
    );
  }
}

const styles = {
  version: {
    padding: "0 10px",
    fontSize: "11px",
    color: "#ccc",
    justifySelf: "flex-end",
    alignContent: "flex-end",
    flex: 1
  }
};

export default GrommetFooter;
