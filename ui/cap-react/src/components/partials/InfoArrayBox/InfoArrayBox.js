import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiOutlineGithub, AiOutlineGitlab } from "react-icons/ai";

const InfoArrayBox = ({ items }) => {
  const renderResourceIcon = resource => {
    const collection = {
      "github.com": (
        <Box margin={{ right: "small" }}>
          <AiOutlineGithub size="18" />
        </Box>
      ),
      "gitlab.com": (
        <Box margin={{ right: "small" }}>
          <AiOutlineGitlab size="18" />
        </Box>
      )
    };

    return collection[resource];
  };

  return (
    <Box>
      {items.map((item, index) => (
        <Box
          key={index}
          colorIndex={index % 2 === 0 ? "light-2" : "light-1"}
          pad="small"
          justify="between"
        >
          <Box direction="row" justify="between" responsive={false}>
            <Box direction="row" responsive={false}>
              <Box align="center" justify="center">
                {renderResourceIcon(item.host)}
              </Box>
              {item.owner}/{item.name}
              {item.branch && (
                <span style={{ marginLeft: "5px" }}>
                  [<b>{item.branch}</b>]
                </span>
              )}
            </Box>
            <Box>
              {item.event_type == "release" ? "on Release/Tag" : "on Push"}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

InfoArrayBox.propTypes = {
  items: PropTypes.object
};

export default InfoArrayBox;
