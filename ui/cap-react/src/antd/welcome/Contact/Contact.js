import { Row, Col, Space, Typography, Button, Grid } from "antd";
import {
  MailOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";

import { ReactComponent as AliceIcon } from "../img/alice.svg";
import { ReactComponent as AtlasIcon } from "../img/atlas.svg";
import { ReactComponent as CmsIcon } from "../img/cms.svg";
import { ReactComponent as LHCbLogo } from "../img/lhcb-logo.svg";

const { useBreakpoint } = Grid;

const Contact = () => {
  const screens = useBreakpoint();

  return (
    <Col span={24}>
      <Row
        justify="center"
        style={{ marginTop: "2rem", background: "#fff", padding: "1rem" }}
      >
        <Col xs={22} lg={12}>
          <Row
            justify={!screens.sm ? "center" : "space-between"}
            gutter={[32, 32]}
          >
            <Space direction="vertical">
              <Button
                type="link"
                href="mailto:analysis-preservation-support@cern.ch"
                icon={<MailOutlined />}
                size="large"
              >
                analysis-preservation-support@cern.ch
              </Button>
              <Button
                type="link"
                href="https://twitter.com/analysispreserv"
                target="_blank"
                icon={<TwitterOutlined />}
                size="large"
              >
                @analysispreserv
              </Button>
              <Button
                type="link"
                href="https://github.com/cernanalysispreservation/analysispreservation.cern.ch"
                target="_blank"
                icon={<GithubOutlined />}
                size="large"
              >
                @cernanalysispreservation
              </Button>
            </Space>
            <Space direction="vertical">
              <Typography.Title level={5} style={{ fontSize: "1.1rem" }}>
                Supported by:
              </Typography.Title>
              <Row justify="center" gutter={[32, 32]}>
                <Space direction="vertical">
                  <Space>
                    <AliceIcon size="medium" />
                    <AtlasIcon size="medium" />
                  </Space>
                  <Space>
                    <CmsIcon size="medium" />
                    <LHCbLogo height="40px" />
                  </Space>
                </Space>
              </Row>
            </Space>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default Contact;
