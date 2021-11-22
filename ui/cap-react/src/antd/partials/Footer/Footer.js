import React from "react";
import { Row, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

const Footer = () => {
  return (
    <Row
      align="bottom"
      justify="center"
      style={{ padding: "5px", background: "#001529" }}
    >
      <Space direction="horizontal" size="small">
        <Paragraph style={{ margin: 0, color: "#fff" }}>
          Copyright {new Date().getFullYear()} © CERN. Created & Hosted by CERN.
          Powered by Invenio Software.
        </Paragraph>
        <Link to="/about">About</Link>
        <Link to="/policy">Policy</Link>
      </Space>
    </Row>
  );
};

Footer.propTypes = {};

export default Footer;
