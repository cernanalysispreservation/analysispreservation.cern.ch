import React, { useState } from "react";
import PropTypes from "prop-types";
import CAPLogoLight from "../../../img/cap-logo-light.svg";
import { Row, Col } from "antd";

import { Link } from "react-router-dom";
import LoggedInMenu from "./LoggedInMenu";
import SimpleMenu from "./Menu";
import "./Header.less";

import AntSearchBar from "../SearchBar";

const Header = ({ logout, permissions, isLoggedIn }) => {
  return (
    <Row align="middle" type="flex">
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
        {isLoggedIn && <AntSearchBar />}
      </Col>
      <Col
        xs={{ order: 2, span: 2 }}
        md={{ span: 4, order: 3 }}
        lg={7}
        xl={6}
        xxl={5}
      >
        {isLoggedIn ? (
          <LoggedInMenu logout={logout} permissions={permissions} />
        ) : (
          <SimpleMenu />
        )}
      </Col>
    </Row>
  );
};

Header.propTypes = {
  logout: PropTypes.func,
  permissions: PropTypes.object,
  isLoggedIn: PropTypes.bool
};

export default Header;
