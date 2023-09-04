import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Typography, Checkbox, Card } from "antd";
import { DownOutlined } from "@ant-design/icons";

const DropDown = ({
  permissions = ["deposit-read"],
  updatePermissions,
}) => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTextFromPermission = () => {
    let selectedPerms = [];

    options.map(opt => {
      if (opt.type == "group") {
        opt.children.map(opch => {
          if (permissions.includes(opch.key))
            selectedPerms.push(`${opch.label} (${opt.key})`);
        });
      } else {
        if (permissions.includes(opt.key)) selectedPerms.push(opt.label);
      }
    });

    return selectedPerms.length > 0
      ? selectedPerms.join(", ")
      : "Select from list";
  };

  const options = [
    {
      key: "D",
      type: "group",
      label: "Deposits/Drafts",
      children: [
        {
          key: "deposit-schema-admin",
          label: "Admin",
          title: "Schema Admin",
          description:
            "Can read, create and update any draft entry of this collection. Can also publish and upload files",
        },
        {
          key: "deposit-schema-read",
          label: "Read",
          title: "Schema Read",
          description: "Can read and search draft entries of this collection.",
        },
        {
          key: "deposit-schema-update",
          label: "Update",
          title: "Schema Update",
          description:
            "Can read, create and update any draft entry of this collection. Can also publish and upload files",
        },
        {
          key: "deposit-schema-create",
          label: "Create",
          title: "Schema Create",
          description: "Can create draft entries for this collection",
        },
        {
          key: "deposit-schema-review",
          label: "Review",
          title: "Schema Review",
          description:
            "Can search, read and review any draft entry of this collection",
        },
      ],
    },
    {
      key: "R",
      type: "group",
      label: "Records/Published",
      children: [
        {
          key: "record-schema-read",
          label: "Read",
          title: "Schema Read",
          description:
            "Can read and search published entries of this collection.",
        },
        {
          key: "record-schema-review",
          label: "Review",
          title: "Schema Review",
          description:
            "Can search, read and review any published entry of this collection",
        },
      ],
    },
  ];

  const generateMenuItems = _options => {
    return _options.map(option => {
      if (option.type == "group") {
        return {
          ...option,
          children: option.children ? generateMenuItems(option.children) : [],
        };
      } else {
        return {
          key: option.key,
          label: (
            <Checkbox
              checked={permissions.includes(option.key)}
              onChange={() => updatePermissions(option.key)}
            >
              <Typography.Title level={5}>{option.title}</Typography.Title>
              <Typography.Text>{option.description}</Typography.Text>
            </Checkbox>
          ),
        };
      }
    });
  };

  return (
    <div>
      <Dropdown.Button
        trigger={["click"]}
        icon={<DownOutlined />}
        menu={{
          items: generateMenuItems(options),
        }}
        open={visible}
        onOpenChange={flag => {
          if (flag) {
            setVisible(true);
          }
        }}
        dropdownRender={menu => {
          return (
            <Card
              bodyStyle={{ padding: 0 }}
              actions={[
                <Button key='close-btn' onClick={() => setVisible(false)}>Close</Button>,
              ]}
            >
              {menu}
            </Card>
          );
        }}
      >
        {getTextFromPermission()}
      </Dropdown.Button>
    </div>
  );
};

DropDown.propTypes = {
  isOwner: PropTypes.bool,
  shouldDisableOptions: PropTypes.bool,
  updatePermissions: PropTypes.func,
  permission: PropTypes.array,
};

export default DropDown;
