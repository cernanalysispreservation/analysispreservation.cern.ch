import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";

import "../../styles/styles.scss";

const CustomTile = props => {
  return (
    <Box
      colorIndex="light-1"
      size={{ width: "medium" }}
      align="center"
      pad="medium"
    >
      <Box size={{ height: "large" }} align="center" flex={false}>
        <Box separator="bottom">
          <Heading tag="h2" margin="medium">
            {props.header}
          </Heading>
        </Box>
        <Box margin="medium" alignSelf="center" justify="end">
          <Box align="center" pad={{ between: "medium" }}>
            {props.content.map((item, index) => {
              return (
                <Box key={index} textAlign="center" align="center">
                  <Heading tag="h3">{item.header}</Heading>
                  <Paragraph size="small" margin="none">
                    {item.paragraph}{" "}
                  </Paragraph>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

CustomTile.propTypes = {
  header: PropTypes.string,
  content: PropTypes.array
};

export default CustomTile;
