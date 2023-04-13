import { Row, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

const Footer = () => {
  return (
    <Row
      align="bottom"
      justify="center"
      style={{ padding: "5px", background: "#001529" }}
    >
      <Space direction="horizontal" size="middle">
        <Text style={{ color: "rgba(255, 255, 255, 0.65)" }}>
          Copyright {new Date().getFullYear()} © CERN. Created & Hosted by CERN.
          Powered by Invenio Software.
        </Text>
        <Link to="/about">About</Link>
        <Link to="/policy">Policy</Link>
      </Space>
    </Row>
  );
};

Footer.propTypes = {};

export default Footer;
