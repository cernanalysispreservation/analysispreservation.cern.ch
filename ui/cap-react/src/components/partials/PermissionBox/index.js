import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

import { AiOutlineEdit } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";

const PermissionBox = ({
  allEmails,
  updateUsers,
  adminUsers,
  usersView = "all"
}) => {
  let emails = usersView === "all" ? allEmails : adminUsers;
  let editList = updateUsers.filter(item => !adminUsers.includes(item));

  return (
    <Box
      direction="row"
      responsive={false}
      style={{ borderRadius: "3px" }}
      wrap
    >
      {emails.map((item, index) => (
        <Box
          key={index}
          colorIndex="light-2"
          margin={{ right: "small", bottom: "small" }}
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
            {editList.includes(item) && <AiOutlineEdit />}
            {adminUsers.includes(item) && <RiAdminLine />}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

PermissionBox.propTypes = {
  access: PropTypes.object,
  allEmails: PropTypes.array,
  updateUsers: PropTypes.array,
  readUsers: PropTypes.array,
  adminUsers: PropTypes.array,
  usersView: PropTypes.string
};

export default PermissionBox;
