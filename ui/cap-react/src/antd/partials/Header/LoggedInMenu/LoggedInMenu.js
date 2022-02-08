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
  PlusOutlined
} from "@ant-design/icons";
import DraftCreate from "../../../drafts/DraftCreate";
import HowToSearchPage from "../../HowToSearch";

const { Item, SubMenu, ItemGroup, Divider } = Menu;

const LoggedInMenu = ({ permissions, logout }) => {
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayHowToSearch, setDisplayHowToSearch] = useState(false);

  return (
    <React.Fragment>
      <DraftCreate
        visible={displayCreate}
        onCancel={() => setDisplayCreate(displayCreate => !displayCreate)}
      />

      <Modal
        visible={displayHowToSearch}
        onCancel={() => setDisplayHowToSearch(false)}
        background="#f5f5f5"
        title="How to Search"
        footer={null}
        width={950}
      >
        <HowToSearchPage />
      </Modal>

      <Menu title="account" theme="dark" selectable={false} mode="horizontal">
        {permissions && (
          <Item
            key="createAnalysis"
            icon={<PlusOutlined />}
            onClick={() => setDisplayCreate(true)}
            data-cy="headerCreateButton"
          >
            Create
          </Item>
        )}
        <Item
          key="faq"
          icon={<QuestionOutlined />}
          onClick={() => setDisplayHowToSearch(true)}
        >
          FAQ
        </Item>
        <SubMenu
          key="SubMenu"
          icon={<UserOutlined size={25} />}
          title="Account"
          data-cy="headerMenu"
        >
          <ItemGroup title="Documentation">
            <Item key="generalDocs" icon={<BookOutlined />}>
              <Link to="/docs/general" target="_blank">
                General Docs
              </Link>
            </Item>
            <Item key="capclient" icon={<CodeOutlined />}>
              <Link to="/docs/cli" target="_blank">
                CAP Client
              </Link>
            </Item>
            <Item key="capapi" icon={<ScheduleOutlined />}>
              <Link to="/docs/api" target="_blank">
                CAP API
              </Link>
            </Item>
          </ItemGroup>
          <ItemGroup title="Support">
            <Item key="ticketservice" icon={<QuestionCircleOutlined />}>
              <a
                href="https://cern.service-now.com/service-portal?id=functional_element&name=Data-Analysis-Preservation"
                target="_blank"
              >
                CERN Ticketing Service
              </a>
            </Item>
            <Item key="capemailsupport" icon={<MailOutlined />}>
              <a href="mailto:analysis-preservation-support@cern.ch">
                CAP Email Support
              </a>
            </Item>
          </ItemGroup>
          <Divider />
          <Item key="settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Item>
          <Item
            key="logout"
            icon={<LogoutOutlined />}
            data-cy="logoutButton"
            onClick={() => logout()}
          >
            Logout
          </Item>
        </SubMenu>
      </Menu>
    </React.Fragment>
  );
};

LoggedInMenu.propTypes = {
  logout: PropTypes.func,
  permissions: PropTypes.bool
};

export default LoggedInMenu;
