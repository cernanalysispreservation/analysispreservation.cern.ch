import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
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
        <Label
          size="small"
          uppercase={props.uppercase || false}
          style={{ overflow: "hidden" }}
        >
          {props.label} {props.status}
        </Label>
      </Box>
      <Box flex={false} margin={{ horizontal: "small" }}>
        {props.icon ? props.icon : null}
      </Box>
      {props.action ? (
        <Box flex={false} margin={{ horizontal: "small" }}>
          {props.action}
        </Box>
      ) : null}
    </Header>
  );
}

SectionHeader.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.element,
  status: PropTypes.element,
  action: PropTypes.element
};
