import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import ReactTooltip from "react-tooltip";
import CircleQuestion from "grommet/components/icons/base/CircleQuestion";
import { CheckBox } from "grommet";

function AnalysisReuseMode(props) {
  const [checked, setChecked] = useState(props.innerProps.formData === "true");
  return (
    <Box pad={{ horizontal: "small" }} colorIndex="light-2">
      <Box>
        <Box
          direction="row"
          wrap={false}
          align="center"
          justify="start"
          responsive={false}
        >
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
          <Box margin={{ left: "small" }}>
            <CheckBox
              disabled={props.innerProps.readonly}
              key={props.innerProps.name}
              toggle={true}
              name={props.innerProps.name}
              onChange={e => {
                props.innerProps.onChange(
                  e.target.checked ? "true" : undefined
                );
                setChecked(e.target.checked);
              }}
              checked={checked}
              id={props.innerProps.name}
            />
          </Box>
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
  properties: PropTypes.array,
  innerProps: PropTypes.object
};

export default AnalysisReuseMode;
