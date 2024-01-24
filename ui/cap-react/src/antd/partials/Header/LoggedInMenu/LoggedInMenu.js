import DraftCreate from "../../../drafts/DraftCreate";
import { CMS, SETTINGS } from "../../../routes";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  BookOutlined,
  CodeOutlined,
  ScheduleOutlined,
  PlusOutlined,
  ToolOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, FloatButton, Grid, Menu, Popover } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { history } from "../../../../store/configureStore";
import AntSearchBar from "../../SearchBar";

const { useBreakpoint } = Grid;

const LoggedInMenu = ({ permissions, logout, roles, location }) => {
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displaySearchPopover, setDisplaySearchPopover] = useState(false);
  const screens = useBreakpoint();

  return (
    <>
      <DraftCreate
        open={displayCreate}
        onCancel={() => setDisplayCreate(displayCreate => !displayCreate)}
      />

      <Menu
        theme="dark"
        selectable={false}
        mode="horizontal"
        items={[
          permissions && {
            key: "createAnalysis",
            label: (
              <Button
                icon={<PlusOutlined />}
                shape={!screens.md && "circle"}
                type="primary"
                size="small"
              >
                {screens.md && "Create"}
              </Button>
            ),
            onClick: () => setDisplayCreate(true),
            "data-cy": "headerCreateButton",
          },
          !screens.md && {
            key: "search",
            label: (
              <Popover
                content={<AntSearchBar />}
                open={displaySearchPopover}
                onOpenChange={() => setDisplaySearchPopover(false)}
              >
                <SearchOutlined />
              </Popover>
            ),
            onClick: () => setDisplaySearchPopover(!displaySearchPopover),
          },
          {
            key: "subMenu",
            label: screens.md && "Account",
            icon: <UserOutlined size={25} />,
            "data-cy": "headerMenu",
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
                        rel="noreferrer"
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
                label: <Link to={SETTINGS}>Settings</Link>,
                icon: <SettingOutlined />,
              },
              {
                key: "logout",
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: () => logout(),
                "data-cy": "logoutButton",
              },
            ],
          },
        ]}
      />

      {!location.pathname.startsWith(CMS) &&
        (roles.get("isSuperUser") || roles.get("schemaAdmin").size > 0) && (
          <FloatButton
            icon={<ToolOutlined />}
            type="primary"
            shape="square"
            description="Admin"
            onClick={() => {
              history.push(CMS);
            }}
          />
        )}
    </>
  );
};

LoggedInMenu.propTypes = {
  logout: PropTypes.func,
  permissions: PropTypes.bool,
  roles: PropTypes.object,
};

export default LoggedInMenu;
