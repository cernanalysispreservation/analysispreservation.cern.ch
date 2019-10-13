import React from "react";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Header from "grommet/components/Header";

import Applications from "./Applications";
import Integrations from "./Integrations";

class SettingsIndex extends React.Component {
  render() {
    return (
      <Box flex={true} colorIndex="light-2">
        <Box flex={false} colorIndex="neutral-1-a">
          <Header
            size="small"
            pad={{ horizontal: "small" }}
            wrap={true}
            justify="between"
          >
            <Label margin="small" pad="none">
              Settings
            </Label>
          </Header>
        </Box>

        <Box flex={true} align="center" pad="medium">
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
