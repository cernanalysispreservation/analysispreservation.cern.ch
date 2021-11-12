import React, { useState } from "react";
import PropTypes from "prop-types";
import CAPLogoLight from "../../../img/cap-logo-light.svg";
import { Menu, Row, Col, Modal } from "antd";
import DraftCreate from "../../../components/drafts/DraftCreate";
import HowToSearchPage from "../../../components/about/HowToSearch";
import { Link } from "react-router-dom";
import "./Header.less";

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
import AntSearchBar from "../SearchBar";
const { Item, SubMenu, ItemGroup, Divider } = Menu;

const Header = ({ logout, permissions }) => {
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayHowToSearch, setDisplayHowToSearch] = useState(false);

  return (
    <Row align="middle" type="flex">
      {displayCreate && (
        <DraftCreate
          toggle={() => setDisplayCreate(displayCreate => !displayCreate)}
        />
      )}

      <Modal
        visible={displayHowToSearch}
        onCancel={() => setDisplayHowToSearch(false)}
        background="#f5f5f5"
        title="How to Search"
        footer={null}
      >
        <HowToSearchPage />
      </Modal>
      <Col xs={{ span: 22, order: 1 }} md={4}>
        <Link to="/">
          <CAPLogoLight height="32px" style={{ verticalAlign: "middle" }} />
        </Link>
      </Col>
      <Col
        xs={{ span: 24, order: 3 }}
        md={{ span: 15, order: 2 }}
        lg={12}
        xl={13}
        xxl={14}
      >
        <AntSearchBar />
      </Col>
      <Col
        xs={{ order: 2, span: 2 }}
        md={{ span: 4, order: 3 }}
        lg={7}
        xl={6}
        xxl={5}
      >
        <Menu title="account" theme="dark" selectable={false} mode="horizontal">
          {permissions && (
            <Item
              key="createAnalysis"
              icon={<PlusOutlined />}
              onClick={() => setDisplayCreate(true)}
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
          >
            <ItemGroup title="Documentation">
              <Item key="generalDocs" icon={<BookOutlined />}>
                <Link to="/docs/general" target="_blank">
                  General Docs
                </Link>
              </Item>
              <Item key="capclient" icon={<CodeOutlined />}>
                <Link to="/docs/cli" target="_blank">
                  Cap Client
                </Link>
              </Item>
              <Item key="capapi" icon={<ScheduleOutlined />}>
                <Link to="/docs/api" target="_blank">
                  Cap Api
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
                  Cap Email Support
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
              onClick={() => logout()}
            >
              Logout
            </Item>
          </SubMenu>
        </Menu>
      </Col>
    </Row>
  );
};

Header.propTypes = {
  logout: PropTypes.func
};

export default Header;
