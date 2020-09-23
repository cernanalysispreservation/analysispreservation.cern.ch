import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdPeopleOutline, MdAttachFile } from "react-icons/md";
import { BsCode } from "react-icons/bs";

const InfoHeaderBox = ({ type = "info", content = null }) => {
  const getIconByType = type => {
    const collection = {
      info: <AiOutlineInfoCircle size={18} />,
      collaboration: <MdPeopleOutline size={18} />,
      code: <BsCode size={18} />,
      file: <MdAttachFile size={18} />
    };

    return collection[type];
  };
  return (
    <Box
      style={{
        borderRadius: "3px",
        padding: "7px"
      }}
      colorIndex="light-1"
      direction="row"
      align="center"
      justify="center"
    >
      <Box
        colorIndex="light-2"
        style={{
          borderRadius: "50%",
          width: "25px",
          height: "25px",
          margin: "0 5px"
        }}
        align="center"
        justify="center"
      >
        {getIconByType(type)}
      </Box>
      {content}
    </Box>
  );
};

InfoHeaderBox.propTypes = {
  content: PropTypes.node,
  type: PropTypes.string
};

export default InfoHeaderBox;
