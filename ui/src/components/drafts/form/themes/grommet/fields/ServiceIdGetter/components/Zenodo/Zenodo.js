import React from "react";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import ZenodoIcon from "./ZenodoIcon";

const Zenodo = ({ data } = data) => {
  return (
    <Box colorIndex="light-3" flex={true}>
      <Box
        flex={false}
        direction="row"
        pad={{ between: "small" }}
        align="start"
        justify="start"
      >
        <Box size="xsmall" flex={false} justify="start">
          <span>ID:</span>{" "}
        </Box>
        <Box
          direction="row"
          justify="center"
          align="center"
          pad={{ between: "small" }}
        >
          <Label flex={true} justify="start" align="start" size="small">
            {data.id}
          </Label>
          <ZenodoIcon />
        </Box>
      </Box>
      <Box
        flex={false}
        direction="row"
        pad={{ between: "small" }}
        align="start"
        justify="start"
      >
        <Box size="xsmall" flex={false} justify="start" align="start">
          <span>Title:</span>{" "}
        </Box>
        <Label flex={true} size="small">
          {data.metadata.title}
        </Label>
      </Box>
      <Box
        flex={false}
        direction="row"
        pad={{ between: "small" }}
        align="start"
        justify="start"
      >
        <Box size="xsmall" flex={false} justify="start">
          <span>DOI:</span>{" "}
        </Box>
        <Label flex={true} size="small">
          {data.metadata.doi}
        </Label>
      </Box>
      <Box
        flex={true}
        direction="row"
        pad={{ between: "small" }}
        align="start"
        justify="start"
      >
        <Box size="xsmall" flex={false} justify="start">
          <span>URL:</span>{" "}
        </Box>
        <Anchor size="small" href={data.links.self}>
          {data.links.self}
        </Anchor>
      </Box>
    </Box>
  );
};

export default Zenodo;
