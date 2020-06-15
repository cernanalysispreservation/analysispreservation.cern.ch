import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiFillInfoCircle } from "react-icons/ai";
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
            background: "#FCECF3",
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <AiFillInfoCircle size={25} color="#F8689E" />
        </Box>
      ),
      collaboration: (
        <Box
          style={{
            background: "#F0F0FF",
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <MdPeopleOutline size={25} color="#6568FB" />
        </Box>
      ),
      code: (
        <Box
          style={{
            background: "#FFF4EF",
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <BsCode size={25} color="#FDC25B" />
        </Box>
      ),
      file: (
        <Box
          style={{
            background: "#E9F9E0",
            borderRadius: "50%",
            width: "33px",
            height: "33px"
          }}
          align="center"
          justify="center"
        >
          <MdAttachFile size={25} color="#509137" />
        </Box>
      )
    };

    return collection[type];
  };
  return (
    <Box
      style={{
        width: "100px",
        height: "90px",
        borderRadius: "2px",
        padding: "7px"
      }}
      direction="column"
      align="center"
      justify="between"
      colorIndex="light-1"
    >
      {getIconByType(type)}
      <Box direction="column" align="center" justify="center">
        <b>{number}</b>
        <Box style={{ color: "rgba(0,0,0,0.4)" }}>{title}</Box>
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
