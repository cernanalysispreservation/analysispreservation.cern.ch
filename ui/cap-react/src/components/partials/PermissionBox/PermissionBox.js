import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";

const PermissionBox = ({ access }) => {
  const adminUsers = access["deposit-admin"].users;
  const readUsers = access["deposit-read"].users;
  const updateUsers = access["deposit-update"].users;
  const allEmails = [...new Set([...adminUsers, ...readUsers, ...updateUsers])];

  return (
    <Box direction="row" responsive={false}>
      {allEmails.map((item, index) => (
        <Box
          key={index}
          colorIndex="light-2"
          margin={{ right: "small" }}
          pad="small"
          style={{ borderRadius: "2px" }}
        >
          {item}
          <Box
            margin={{ top: "small" }}
            direction="row"
            responsive={false}
            justify="around"
          >
            <AiOutlineEye
              color={
                readUsers.includes(item) ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.3)"
              }
            />
            <AiOutlineEdit
              color={
                updateUsers.includes(item) ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.3)"
              }
            />
            <RiAdminLine
              color={
                adminUsers.includes(item) ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.3)"
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

PermissionBox.propTypes = {
  access: PropTypes.object
};

export default PermissionBox;
