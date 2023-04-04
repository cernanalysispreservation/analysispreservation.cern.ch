import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  BookOutlined,
  CodeOutlined,
  ScheduleOutlined,
  QuestionOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DraftCreate from "../../../drafts/DraftCreate";
import HowToSearchPage from "../../HowToSearch";

const LoggedInMenu = ({ permissions, logout }) => {
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayHowToSearch, setDisplayHowToSearch] = useState(false);

  return (
    <React.Fragment>
      <DraftCreate
        open={displayCreate}
        onCancel={() => setDisplayCreate(displayCreate => !displayCreate)}
      />

      <Modal
        open={displayHowToSearch}
        onCancel={() => setDisplayHowToSearch(false)}
        background="#f5f5f5"
        title="How to Search"
        footer={null}
        width={950}
      >
        <HowToSearchPage />
      </Modal>

      <Menu
        title="account"
        theme="dark"
        selectable={false}
        mode="horizontal"
        items={[
          permissions && {
            key: "createAnalysis",
            label: "Create",
            icon: <PlusOutlined />,
            onClick: () => setDisplayCreate(true),
          },
          {
            key: "faq",
            label: "FAQ",
            icon: <QuestionOutlined />,
            onClick: () => setDisplayHowToSearch(true),
          },
          {
            key: "subMenu",
            label: "Account",
            icon: <UserOutlined size={25} />,
            children: [
              {
                key: "documentation",
                label: "Documentation",
                type: "group",
                children: [
                  {
                    key: "generalDocs",
                    label: (
                      <Link to="/docs/general" target="_blank">
                        General Docs
                      </Link>
                    ),
                    icon: <BookOutlined />,
                  },
                  {
                    key: "capClient",
                    label: (
                      <Link to="/docs/cli" target="_blank">
                        CAP Client
                      </Link>
                    ),
                    icon: <CodeOutlined />,
                  },
                  {
                    key: "capApi",
                    label: (
                      <Link to="/docs/api" target="_blank">
                        CAP API
                      </Link>
                    ),
                    icon: <ScheduleOutlined />,
                  },
                ],
              },
              {
                key: "support",
                label: "Suport",
                type: "group",
                children: [
                  {
                    key: "ticketService",
                    label: (
                      <a
                        href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation"
                        target="_blank"
                      >
                        CERN Ticketing Service
                      </a>
                    ),
                    icon: <QuestionCircleOutlined />,
                  },
                  {
                    key: "capemailsupport",
                    label: (
                      <a href="mailto:analysis-preservation-support@cern.ch">
                        CAP Email Support
                      </a>
                    ),
                    icon: <MailOutlined />,
                  },
                ],
              },
              {
                type: "divider",
                style: { borderColor: "gray", margin: "15px" },
              },
              {
                key: "settings",
                label: <Link to="/settings">Settings</Link>,
                icon: <SettingOutlined />,
              },
              {
                key: "logout",
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: () => logout(),
              },
            ],
          },
        ]}
      />
    </React.Fragment>
  );
};

LoggedInMenu.propTypes = {
  logout: PropTypes.func,
  permissions: PropTypes.bool,
};

export default LoggedInMenu;
