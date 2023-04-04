import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Menu, Typography, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";

const DropDown = ({
  permission = ["deposit-read"],
  updatePermissions,
  shouldDisableOptions = false,
  isOwner = false,
}) => {
  const getTextFromPermission = () => {
    let perm = "deposit-read";
    if (permission.includes("deposit-update")) perm = "deposit-update";
    if (permission.includes("deposit-admin")) perm = "deposit-admin";
    const choices = {
      "deposit-read": "Read",
      "deposit-update": "Write",
      "deposit-admin": "Admin",
    };

    return choices[perm];
  };

  return (
    <Dropdown
      disabled={isOwner || shouldDisableOptions}
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "deposit-read",
            label: (
              <Checkbox checked>
                <Typography.Title level={5}>Read</Typography.Title>
                <Typography.Text>
                  Users can access a record to read metadata and post a review
                </Typography.Text>
              </Checkbox>
            ),
          },
          { type: "divider" },
          {
            key: "deposit-update",
            label: (
              <Checkbox
                onChange={() => updatePermissions("deposit-update")}
                checked={permission.includes("deposit-update")}
              >
                <Typography.Title level={5}>Write</Typography.Title>
                <Typography.Text>
                  Users can read, edit, review metadata and upload files and
                  wehooks
                </Typography.Text>
              </Checkbox>
            ),
          },
          { type: "divider" },
          {
            key: "deposit-admin",
            label: (
              <Checkbox
                checked={permission.includes("deposit-admin")}
                onChange={() => updatePermissions("deposit-admin")}
              >
                <Typography.Title level={5}>Admin</Typography.Title>
                <Typography.Text>
                  Users can read, edit, review metadata and upload files and
                  wehooks, publish and delete
                </Typography.Text>
              </Checkbox>
            ),
          },
        ],
      }}
    >
      <Button>
        {getTextFromPermission()}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

DropDown.propTypes = {
  isOwner: PropTypes.bool,
  shouldDisableOptions: PropTypes.bool,
  updatePermissions: PropTypes.func,
  permission: PropTypes.array,
};

export default DropDown;
