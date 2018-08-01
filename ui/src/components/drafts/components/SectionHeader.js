import React from "react";
import PropTypes from "prop-types";

import { Box, Header } from "grommet";

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
        <span>{props.label}</span>
      </Box>
      <Box flex={false} margin={{ horizontal: "small" }}>
        {props.icon ? props.icon : null}
      </Box>
    </Header>
  );
}

SectionHeader.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element
};
