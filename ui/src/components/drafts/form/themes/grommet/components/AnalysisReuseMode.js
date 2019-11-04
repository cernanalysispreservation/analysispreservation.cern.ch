import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Paragraph from "grommet/components/Paragraph";
import ReactTooltip from "react-tooltip";
import CircleQuestion from "grommet/components/icons/base/CircleQuestion";
import SwitchWidget from "../widgets/SwitchWidget";

function AnalysisReuseMode(props) {
  return (
    <Box
      pad={{ horizontal: "small", vertical: "medium" }}
      align="between"
      colorIndex="light-2"
    >
      <Box flex={false} justify="between">
        <Box flex={true} direction="row" wrap={false} align="center">
          <Label margin="small">
            Reuse mode {"  "}
            <CircleQuestion size="xsmall" data-tip data-for="reuseMode" />
            <ReactTooltip id="reuseMode" place="right">
              <Paragraph margin="none" style={{ color: "#fff" }}>
                Turn this mode on if you want to capture additional information:
              </Paragraph>
              <Paragraph margin="none" style={{ color: "#fff" }}>
                about main and auxiliary measurements, systematic uncertainties,
              </Paragraph>
              <Paragraph margin="none" style={{ color: "#fff" }}>
                background estimates and final state particles
              </Paragraph>
            </ReactTooltip>
          </Label>
        </Box>
        <Box flex="shrink">
          <SwitchWidget {...props.innerProps} id="analysis_reuse_mode" />
        </Box>
      </Box>
    </Box>
  );
}

AnalysisReuseMode.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.array
};

export default AnalysisReuseMode;
