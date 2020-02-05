import React from "react";

import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

const Ror = ({ data } = data) => {
  return (
    <Box colorIndex="light-3" flex={true}>
      <Box
        flex={false}
        direction="column"
        pad={{ between: "small" }}
        align="start"
        justify="start"
      >
        <Heading tag="h5">{data.name}</Heading>

        <Box
          flex={false}
          direction="row"
          pad={{ between: "small" }}
          align="center"
          justify="start"
        >
          <Paragraph margin="none" style={{ color: "grey" }}>
            {data.acronyms.length > 0 ? `${data.acronyms},` : ""}
            {data.country.country_code}
          </Paragraph>
          <Box
            style={{
              padding: "0.09em .4em",
              borderRadius: "3px"
            }}
            colorIndex="neutral-1"
            align="center"
            justify="center"
          >
            {data.country.country_name}
          </Box>
          <Box
            style={{
              padding: "0.09em .4em",
              borderRadius: "3px"
            }}
            colorIndex="neutral-1-a"
            align="center"
            justify="center"
          >
            {data.types}
          </Box>
        </Box>
        <Anchor label={data.links} href={data.links} />
      </Box>
    </Box>
  );
};

export default Ror;
