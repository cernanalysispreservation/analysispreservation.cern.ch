import React from "react";

import Box from "grommet/components/Box";

import Applications from "./Applications";
import Integrations from "./Integrations";
import Profile from "./Profile";

class SettingsIndex extends React.Component {
  render() {
    return (
      <Box flex colorIndex="light-2">
        <Box align="center" pad="medium">
          <Box size="xlarge" margin={{ bottom: "medium" }}>
            <Profile />
          </Box>
          <Box size="xlarge" margin={{ bottom: "medium" }}>
            <Applications />
          </Box>
          <Box size="xlarge" margin={{ bottom: "medium" }}>
            <Integrations />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default SettingsIndex;
