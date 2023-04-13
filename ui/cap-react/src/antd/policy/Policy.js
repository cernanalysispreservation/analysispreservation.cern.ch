import DocumentTitle from "../partials/DocumentTitle";
import { Col, Row, Space, Typography } from "antd";

const Policy = () => {
  return (
    <DocumentTitle title="Privacy Policy">
      <Row justify="center">
        <Col xs={20} md={16} lg={10}>
          <Space direction="vertical" size="large">
            <Typography.Title>Privacy Policy</Typography.Title>
            <Typography.Paragraph>
              CERN does not track, collect or retain personal information from
              users of the CERN Analysis Preservation service, except as
              otherwise provided herein. In order to enhance CERN Analysis
              Preservation and monitor traffic, non-personal information such as
              IP addresses and cookies may be tracked and retained, as well as
              log files shared in aggregation with other community services.
              User provided information, such as metadata, will be integrated
              into the database without displaying its source.
            </Typography.Paragraph>
            <Typography.Paragraph>
              CERN Analysis Preservation will take all reasonable measures to
              protect the privacy of its users and to resist service
              interruptions, intentional attacks, or other events that may
              compromise the security of the CERN Analysis Preservation website.
            </Typography.Paragraph>
            <Typography.Paragraph>
              If you have any questions about the CERN Analysis Preservation
              privacy policy, please{" "}
              <Typography.Link href="mailto:analysis-preservation-support@cern.ch">
                contact
              </Typography.Link>
            </Typography.Paragraph>
            <Typography.Paragraph>
              See also CERN’s{" "}
              <Typography.Link
                href="https://home.cern/data-privacy-protection-policy"
                target="_blank"
              >
                Data Privacy Protection Policy.
              </Typography.Link>
            </Typography.Paragraph>
          </Space>
        </Col>
      </Row>
    </DocumentTitle>
  );
};

export default Policy;
