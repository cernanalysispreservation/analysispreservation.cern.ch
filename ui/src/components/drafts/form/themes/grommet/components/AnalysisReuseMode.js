import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import ReactTooltip from "react-tooltip";
import CircleQuestion from "grommet/components/icons/base/CircleQuestion";
import SwitchWidget from "../widgets/SwitchWidget";

function AnalysisReuseMode(props) {
  return (
    <Box
      pad={{ horizontal: "small"}}
      colorIndex="light-2"
    >
      <Box>
        <Box direction="row" wrap={false} align="center" justify="between">
          <Heading tag="h5" margin="small">
              <strong> Reuse mode </strong>
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
          </Heading>
          <SwitchWidget {...props.innerProps} id="analysis_reuse_mode"/>
        </Box>
        <Box flex="shrink" />
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
