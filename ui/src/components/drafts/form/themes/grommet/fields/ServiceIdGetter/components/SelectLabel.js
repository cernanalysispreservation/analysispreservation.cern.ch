import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import ZenodoIcon from "./Zenodo/ZenodoIcon";
import ORCidIcon from "./ORCID/ORCidIcon";
import RORIcon from "./ROR/RORIcon";

const SelectLabel = ({ service }) => {
  return (
    <Box
      flex={false}
      direction="row"
      align="center"
      justify="center"
      pad={{ horizontal: "small", between: "small" }}
    >
      <Box>{IconFactory[service.value]}</Box>
      <Box>{service.label}</Box>
    </Box>
  );
};

SelectLabel.propTypes = {
  service: PropTypes.object
};

export default SelectLabel;

const IconFactory = {
  orcid: <ORCidIcon />,
  zenodo: <ZenodoIcon />,
  ror: <RORIcon />
};
