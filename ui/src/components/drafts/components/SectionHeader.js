import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";

export default function SectionHeader(props) {
  return (
    <Header
      justify="center"
      alignContent="center"
      size="small"
      colorIndex="grey-4"
      pad="none"
    >
      <Box
        flex={true}
        justify="between"
        alignContent="center"
        direction="row"
        pad={{ horizontal: "small" }}
        responsive={false}
      >
        <span>
          {props.label} {props.status}
        </span>
      </Box>
      <Box flex={false} margin={{ horizontal: "small" }}>
        {props.icon ? props.icon : null}
      </Box>
      <Box flex={false} margin={{ horizontal: "small" }}>
        {props.action ? props.action : null}
      </Box>
    </Header>
  );
}

SectionHeader.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  status: PropTypes.element,
  action: PropTypes.element
};
