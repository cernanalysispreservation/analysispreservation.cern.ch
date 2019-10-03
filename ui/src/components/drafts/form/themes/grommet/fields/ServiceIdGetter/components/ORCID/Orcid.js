import React from "react";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Anchor from "grommet/components/Anchor";

import ORCidIcon from "./ORCidIcon";

const Orcid = ({ data } = data) => {
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
          <Label flex={true} justify="center" align="center" size="small">
            {" "}
            {data["orcid-identifier"].path}
          </Label>
          <ORCidIcon />
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
          <span>Name:</span>{" "}
        </Box>
        <Label flex={true} size="small">
          {data.person.name["family-name"].value}{" "}
          {data.person.name["given-names"].value}
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
        <Anchor size="small" href={data["orcid-identifier"].uri}>
          {data["orcid-identifier"].uri}
        </Anchor>
      </Box>
    </Box>
  );
};

export default Orcid;
