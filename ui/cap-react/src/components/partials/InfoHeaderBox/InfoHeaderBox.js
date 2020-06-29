import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdPeopleOutline, MdAttachFile } from "react-icons/md";
import { BsCode } from "react-icons/bs";

const InfoHeaderBox = ({
  title = "placeholder text",
  number = "1",
  type = "info"
}) => {
  const getIconByType = type => {
    const collection = {
      info: (
        <Box
          style={{
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <AiOutlineInfoCircle size={18} />
        </Box>
      ),
      collaboration: (
        <Box
          style={{
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <MdPeopleOutline size={18} />
        </Box>
      ),
      code: (
        <Box
          style={{
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <BsCode size={18} />
        </Box>
      ),
      file: (
        <Box
          style={{
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <MdAttachFile size={18} />
        </Box>
      )
    };

    return collection[type];
  };
  return (
    <Box
      style={{
        borderRadius: "2px",
        padding: "7px"
      }}
      align="center"
      justify="center"
      colorIndex="light-1"
      direction="row"
    >
      {getIconByType(type)}
      <Box direction="row" align="center" justify="between">
        <b>{number}</b>
        <Box style={{ color: "rgba(0,0,0,0.4)", marginLeft: "5px" }}>
          {title}
        </Box>
      </Box>
    </Box>
  );
};

InfoHeaderBox.propTypes = {
  title: PropTypes.string,
  number: PropTypes.string,
  type: PropTypes.string
};

export default InfoHeaderBox;
